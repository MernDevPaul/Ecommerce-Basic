import API from "./ApiService";

class Service {
  constructor() {
    this.api = new API();
  }

  create = async (dispatch, actions, url, data, calback) => {
    try {
      const res = await this.api.create(dispatch, actions, url, data, calback);
      calback(null, res);
      return res;
    } catch (error) {
      calback(error, null);
      return error;
    }
  };
  update = async (dispatch, actions, url, params, data, calback) => {
    try {
      const res = await this.api.update(
        dispatch,
        actions,
        url,
        params,
        data,
        calback
      );
      calback(null, res);
      return res;
    } catch (error) {
      calback(error, null);
      return error;
    }
  };
  remove = async (dispatch, actions, url, params, calback) => {
    try {
      const res = await this.api.remove(
        dispatch,
        actions,
        url,
        params,
        calback
      );
      calback(null, res);
      return res;
    } catch (error) {
      calback(error, null);
      return error;
    }
  };
  getSingle = async (dispatch, actions, url, params, calback) => {
    try {
      const res = await this.api.getSingle(
        dispatch,
        actions,
        url,
        params,
        calback
      );
      calback(null, res);
      return res;
    } catch (error) {
      calback(error, null);
      return error;
    }
  };
  getAll = async (dispatch, actions, url, params, calback) => {
    try {
      const res = await this.api.getAll(
        dispatch,
        actions,
        url,
        params,
        calback
      );
      calback(null, res);
      return res;
    } catch (error) {
      calback(error, null);
      return error;
    }
  };
}

export default Service;
