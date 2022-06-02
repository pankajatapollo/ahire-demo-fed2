const { RESTDataSource } = require('apollo-datasource-rest');

class SaleAPI extends RESTDataSource {
    willSendRequest(request) {
        request.headers.set('Defaultlimit', this.context.defaultlimit)
    }
    
    constructor() {
      super();
      this.baseURL = 'http://localhost:8080/';
    }
  
    async getAllSales() {
      const response = await this.get('pos');
      return response;
    }
  
    async getSalesByUPC({ upc }) {
      const res = await this.get(`pos/upc/${encodeURIComponent(upc)}`);
      return res;
    }
    
    async getSalesByStoreNbr({ storenbr }) {
        const res = await this.get(`pos/store/${encodeURIComponent(storenbr)}`);
        return res;
      }

    async getSalesByDaily({ daily }) {
        const res = await this.get(`pos/daily/${encodeURIComponent(daily)}`);
        return res;
      }
    
  }

module.exports = SaleAPI