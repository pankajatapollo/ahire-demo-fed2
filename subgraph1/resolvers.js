const jwt = require('jsonwebtoken');

module.exports = {
    Query: {
      sales: (function(_, { upc, store, daily }, { dataSources }) { 
          if (upc === undefined && store === undefined && daily === undefined) {
              return dataSources.saleAPI.getAllSales();
          } else if(upc !== undefined) {
            return dataSources.saleAPI.getSalesByUPC({ upc: upc });
          } else if(store !== undefined) {
            return dataSources.saleAPI.getSalesByStoreNbr({ storenbr: store });
          } else {
            return dataSources.saleAPI.getSalesByDaily({ daily: daily });
          }
      })
    },
    Mutation: {
      login: (function(_, { email, password }) {
        return jwt.sign({
          "http://localhost:8085/" : {
            "roles" : [ "admin" ],
            "permissions" : [ "read:any_account" ]
          }}, 
          "ASECRETKEY-DO-NOT-EMBED-HERE-THIS",
          {algorithm: "HS256", subject: "USER1", expiresIn: "1d"} );

      })
    },
    Item: {
      __resolveReference(item, context, info) {
        let theresult = context.dataSources.saleAPI.getSalesByUPC({upc: item.UPC});
        return {UPC: item.UPC, Sales: theresult};
        
      }
    },
    Shop: {
      __resolveReference(shop, context, info) {
        let theresult = context.dataSources.saleAPI.getSalesByStoreNbr({storenbr: shop.StoreNbr});
        return {StoreNbr: shop.StoreNbr, Sales: theresult};
      }
    },

    Sale: {
      __resolveReference(sale, context, info) {
        let theresult = context.dataSources.saleAPI.getSalesByUPC({upc: sale.UPC});
        let filteredbystorenbranddaily = theresult.find(s => (s.StoreNbr == sale.StoreNbr && s.Daily == sale.Daily));
        console.log(`In the Sale subgraph ${filteredbystorenbranddaily}`);
        return (Array.isArray(filteredbystorenbranddaily) ? filteredbystorenbranddaily[0]: filteredbystorenbranddaily);
      }
    }
  };