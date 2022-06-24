require("./open-telemetry.js");
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');

const log4js = require('log4js');
const log4jslogger = log4js.getLogger("SALE");
log4jslogger.level = "debug";

const SaleAPI = require('./datasources/sale');
const resolvers = require('./resolvers');
const myplugin = require('./customplugin');

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
  plugins: [ myplugin ],
  context: ({ req }) => ({
    defaultlimit: req.headers.defaultlimit || 20,
    req: req,
    logger: log4jslogger
  })
});

const PORT = process.env.PORT || 8085;

// The `listen` method launches a web server.
server.listen({port:PORT}).then(({ url }) => {
  console.log(`🚀 SALE Subgraph Server ready at ${url}`);
});
