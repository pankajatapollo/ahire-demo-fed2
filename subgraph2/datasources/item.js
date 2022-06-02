const { RESTDataSource } = require('apollo-datasource-rest');

class ProductAPI extends RESTDataSource {
    willSendRequest(request) {
        request.headers.set('Defaultlimit', this.context.defaultlimit)
    }
    
    constructor() {
      super();
      this.baseURL = 'http://localhost:8081/';
    }
  
    async getAllProducts() {
      const response = await this.get('product');
      return response;
    }
  
    async getProductByUPC({ upc }) {
      const res = await this.get(`product/upc/${encodeURIComponent(upc)}`);
      return res;
    }
    
  }

module.exports = ProductAPI