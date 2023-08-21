import axios from "axios";
import { API_URL, BASE_URL, COMPANY_CODE, CURRENCY } from "../../config";
class API {
  constructor() {
    this.baseUrl = API_URL;
    this.apiUrl = BASE_URL;
    this.companyCode = COMPANY_CODE;
    this.currency = CURRENCY;
    this.webtoken = localStorage.getItem("web_token");
    this.isbuyer = localStorage.getItem("is_buyer");
    this.header = {
      authorization: `Bearer ${localStorage.getItem("web_token")}`,
      company_code: this.companyCode,
    };
  }

  async callAPI(method, dispatch, actions, url, data, callback) {
    const [startAction, successAction, errorAction, actionType] = actions;
    if (startAction) {
      dispatch(startAction());
    }
    try {
      const res = await method(`${this.baseUrl}${url}`, data, {
        headers: this.header,
      });
      if (successAction) {
        dispatch(successAction({ type: actionType, data: res.data }));
      }
      if (callback) {
        callback(null, res);
      }
      return res;
    } catch (error) {
      if (errorAction) {
        dispatch(errorAction(error.message));
      }
      if (callback) {
        callback(error, null);
      }
      return error;
    }
  }

  async getAll(dispatch, actions, url, params = {}, callback) {
    return this.callAPI(axios.get, dispatch, actions, url, {headers: this.header, params }, callback);
  }

 async getSingle(dispatch, actions, url, params, callback) {
    return this.callAPI(axios.get, dispatch, actions, `${url}/${params}`, { headers: this.header }, callback);
  }

  async create(dispatch, actions, url, data, callback) {
    return this.callAPI(axios.post, dispatch, actions, url, data, callback);
  }

  async update(dispatch, actions, url, params, data, callback) {
    return this.callAPI(axios.put, dispatch, actions, `${url}/${params}`, data, callback);
  }

  async remove(dispatch, actions, url, params, callback) {
    return this.callAPI(axios.delete, dispatch, actions, `${url}/${params}`, { headers: this.header }, callback);
  }

  async removeMany(dispatch, actions, url, data, callback) {
    return this.callAPI(axios.delete, dispatch, actions, url, {data,headers:this.header}, callback);
  }
}

export default API;
