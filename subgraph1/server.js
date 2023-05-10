import "./open-telemetry.js";
import fs from 'fs';
import dotenv from 'dotenv';
import { SaleAPI } from './datasources/sale.js';
import { resolvers } from './resolvers.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';
import { myplugin } from './customplugin.js';
import log4js from 'log4js';


dotenv.config();
const log4jslogger = log4js.getLogger("SALE");
log4jslogger.level = "debug";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schema = gql(fs.readFileSync('schema.graphql', 'utf8'))
  
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
  schema: buildSubgraphSchema([{ typeDefs: schema, resolvers }]),
  dataSources: () => ({
    saleAPI: new SaleAPI()
  }),
  logger: log4jslogger,
  plugins: [ myplugin ]
});

const PORT = process.env.PORT || 8085;

class ContextValue {
  constructor({ req, server }) {
    this.defaultlimit = req.headers.defaultlimit || 20;
    this.req = req;
    const { cache } = server;
    this.logger = log4jslogger;
    this.dataSources = {
      saleAPI: new SaleAPI( { cache, contextValue: this }),
    };
  }
}

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => new ContextValue({ req, server }),
  listen: { port: PORT }
});

console.log(`🚀 SALE Subgraph Server ready at ${url}`);

