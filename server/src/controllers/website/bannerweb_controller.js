const express = require("express");
const asyncHandler = require("express-async-handler");
const banner = require("../../models/banner_model");
const BaseController = require("../base_controller");
const { success } = require("../../utils/response");

class CompanyProfileWebController extends BaseController {
  constructor() {
    super();
    this.model = banner;
    this.router = express.Router();
    this.router.get("/", asyncHandler(this.getHandler.bind(this)));
  }
  //company get handler
  async getHandler(req, res) {
    const { company_code } = req.headers;
    const check = await this.find(this.model, {...req.query, company_code:company_code,status:true }, {}, {});
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", check);
  }

}


module.exports = new CompanyProfileWebController().router;