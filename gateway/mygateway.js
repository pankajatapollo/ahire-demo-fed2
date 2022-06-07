require("./open-telemetry.js");
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginUsageReporting } = require('apollo-server-core');
const { ApolloServerPluginInlineTrace } = require('apollo-server-core');
const { ApolloGateway } = require('@apollo/gateway');
const express = require('express'); 
const dotenv = require('dotenv');
dotenv.config();

const port = 4001;
const app = express();
// Initialize an ApolloGateway instance and pass it
// the supergraph schema as a string
const gateway = new ApolloGateway({ debug: true });

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
  gateway,
  subscriptions: false,
  plugins: [
    ApolloServerPluginUsageReporting({
      sendVariableValues: { all: true },
      sendHeaders: { all: true }
    }),
    ApolloServerPluginInlineTrace()
  ],
  apollo: {
        key: process.env.APOLLO_KEY,
        graphRef: process.env.APOLLO_GRAPH_REF
  },
  context: ({ req }) => ({
      defaultlimit: (req.headers.defaultlimit || 10)
  })
});
const http = require('http');
const httpServer = http.createServer(app);

server.start().then( res =>
    {        
        server.applyMiddleware({ app }); 
        httpServer.listen(port, "127.0.0.1", () => { console.log(`🚀 Gateway Server is ready at port ${port} and at endpoint ${server.graphqlPath}`); } );
    });
