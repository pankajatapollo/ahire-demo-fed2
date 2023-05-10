import { RESTDataSource } from '@apollo/datasource-rest';

export class SaleAPI extends RESTDataSource {
  

  constructor({ cache, contextValue }) {
    super();
    this.baseURL = 'http://localhost:8080/';
    this.context = contextValue;
    this.cache = cache;
  }
  
  willSendRequest(_path, request) {
        request.headers['Defaultlimit'] = this.context.defaultlimit;
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
