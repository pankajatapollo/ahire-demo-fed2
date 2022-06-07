require("./open-telemetry.js");
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');


const ShopAPI = require('./datasources/shop')

const resolvers = require('./resolvers')


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schema = gql(fs.readFileSync('schema.graphql', 'utf8'))
  
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
  schema: buildSubgraphSchema([{ typeDefs: schema, resolvers }]),
  dataSources: () => ({
    shopAPI: new ShopAPI()
  }),
  context: ({ req }) => ({
    defaultlimit: 20
  })
});

const PORT = process.env.PORT || 8087;

// The `listen` method launches a web server.
server.listen({port:PORT}).then(({ url }) => {
  console.log(`🚀 Stores Subgraph Server ready at ${url}`);
});
