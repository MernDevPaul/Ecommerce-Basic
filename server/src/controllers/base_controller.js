const CrudService = require("../utils/crud_service");

class BaseController extends CrudService {
  constructor() {
    super();
  }
}

module.exports = BaseController;
