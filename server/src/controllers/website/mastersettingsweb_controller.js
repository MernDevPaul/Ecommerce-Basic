const express = require("express");
const asyncHandler = require("express-async-handler");
const mastersettings = require("../../models/mastersettings_model");
const BaseController = require("../base_controller");
const { success } = require("../../utils/response");

class MasterSettingsWebController extends BaseController {
  constructor() {
    super();
    this.model = mastersettings;
    this.router = express.Router();
    this.router.get("/", asyncHandler(this.getHandler.bind(this)));
  }
  //company get handler
  async getHandler(req, res) {
    const { company_code } = req.headers;
    const check = await this.find(this.model, { ...req.query, company_code: company_code, status: true }, {}, {});
    
    success(res, 200, true, "Get Successfully", check);
  }

}


module.exports = new MasterSettingsWebController().router;