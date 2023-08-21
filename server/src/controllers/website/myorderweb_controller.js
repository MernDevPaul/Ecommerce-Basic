const express = require("express");
const asyncHandler = require("express-async-handler");
const order = require("../../models/order_module");
const orderlogs = require("../../models/orderlogs_model");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateid");
const BaseController = require("../base_controller");
class MyOrderWebController extends BaseController {
  constructor() {
    super();
    this.model = order;
    this.orderlogs = orderlogs;
    this.router = express.Router();
    this.router.get("/:id", asyncHandler(this.getSingle.bind(this)));
    this.router.get("/", asyncHandler(this.getAll.bind(this)));
  }

 
  async getSingle(req, res) {
    const options = {};
    options.populate = "buyer_id";
    const { company_code, _id } = req.buyer;
    const { id } = req.params;
    validateId(id);
    const check = await this.findOne(this.model, { _id: id, company_code: company_code, buyer_id: _id }, {}, {options});
    const order_log = await this.find(this.orderlogs, { order_id: id }, {}, {});
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", {
      order: check,
      order_logs: order_log,
    });
  }

  async getAll(req, res) {
    const options = {};
    options.sort = { order_no: -1 };
    const { company_code, _id } = req.buyer;
    const check = await this.find(this.model, {company_code: company_code, buyer_id: _id}, {}, {options});
    success(res, 200, true, "Get Successfully", check);
  }
}

module.exports = new MyOrderWebController().router;
