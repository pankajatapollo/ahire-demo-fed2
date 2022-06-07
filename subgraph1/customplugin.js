const log4js = require('log4js');
const log4jslogger = log4js.getLogger("CUSTOMPLUGIN");
log4jslogger.level = "debug";
const logger = log4jslogger;

module.exports = {
    // Fires whenever a GraphQL request is received from a client.
    async requestDidStart(requestContext) {
      logger.log('Request started! Query:\n' +
        requestContext.request.query);
  
      return {
        // Fires whenever Apollo Server will parse a GraphQL
        // request to create its associated document AST.
        async parsingDidStart(requestContext) {
          logger.log('Parsing started!');
        },
  
        // Fires whenever Apollo Server will validate a
        // request's document AST against your GraphQL schema.
        async validationDidStart(requestContext) {
          logger.log('Validation started!');
        },
  
      }
    },
  };