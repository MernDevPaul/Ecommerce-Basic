const express = require("express");
const asyncHandler = require("express-async-handler");
const pages = require("../../models/pages_model");
const BaseController = require("../base_controller");
const { success } = require("../../utils/response");


class PagesWebController extends BaseController {
  constructor() {
    super();
    this.model = pages;
    this.router = express.Router();
    this.router.get("/:id", asyncHandler(this.getSingleHandler.bind(this)));
    this.router.get("/", asyncHandler(this.getHandler.bind(this)));
  }

  async getSingleHandler(req, res) {
    const { company_code } = req.headers;
    const { id } = req.params;
    const check = await this.findOne(this.model, {...req.query,slug:id, company_code:company_code,status:true }, {}, {});
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", check);
  }

  //get handler
  async getHandler(req, res) {
    const { company_code } = req.headers;
    const check = await this.find(this.model, {...req.query, company_code:company_code,status:true }, {}, {});
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", check);
  }

}


module.exports = new PagesWebController().router;