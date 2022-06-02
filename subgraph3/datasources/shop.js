const { RESTDataSource } = require('apollo-datasource-rest');

class ShopAPI extends RESTDataSource {
    willSendRequest(request) {
        request.headers.set('Defaultlimit', this.context.defaultlimit)
    }
    
    constructor() {
      super();
      this.baseURL = 'http://localhost:8082/';
    }
  
    async getAllShops() {
      const response = await this.get('store');
      return response;
    }
  
    async getShopByStoreNbr({ storenbr }) {
      const res = await this.get(`store/storenbr/${encodeURIComponent(storenbr)}`);
      return res;
    }
    
  }

module.exports = ShopAPI