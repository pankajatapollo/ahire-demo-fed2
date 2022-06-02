
module.exports = {
    Query: {
      products: (function(_, { upc }, { dataSources }) { 
        if (upc === undefined) {
            return dataSources.productAPI.getAllProducts();
        } else {
          return dataSources.productAPI.getProductByUPC({ upc: upc });
        }
      })
    },
    Item: {
      __resolveReference(item, context, info) {
        let theresult = context.dataSources.productAPI.getProductByUPC({upc: item.UPC });
        return (Array.isArray(theresult) ? theresult[0]: theresult);
      }
    },
    Sale: {
      async __resolveReference(sale, context, info) {
        let theresult = await context.dataSources.productAPI.getProductByUPC({upc: sale.UPC });
        let myitem = (Array.isArray(theresult) ? theresult[0]: theresult);
        return {UPC: sale.UPC, 
                StoreNbr: sale.StoreNbr, 
                Daily: sale.Daily, 
                Product: myitem };

      }
    }

  };

  