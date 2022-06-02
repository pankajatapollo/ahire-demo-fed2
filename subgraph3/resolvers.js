
module.exports = {
    Query: {
      stores: (function(_, { storenbr }, { dataSources }) { 
        if (storenbr === undefined) {
            return dataSources.shopAPI.getAllShops();
        } else {
          return dataSources.shopAPI.getShopByStoreNbr({ storenbr: storenbr });
        }
      })
    },
    Shop: {
      __resolveReference(shop, context, info) {
        let theresult = context.dataSources.shopAPI.getShopByStoreNbr({storenbr: shop.StoreNbr });
        return (Array.isArray(theresult) ? theresult[0]: theresult);
      }
     
    },
    Sale: {
      async __resolveReference(sale, context, info) {
        let theresult = await context.dataSources.shopAPI.getShopByStoreNbr({storenbr: sale.StoreNbr });
        let myitem = (Array.isArray(theresult) ? theresult[0]: theresult);
        return { UPC: sale.UPC, 
                 StoreNbr: sale.StoreNbr, 
                 Daily: sale.Daily, 
                 Store: myitem };
      }
    }

  };