const express = require("express");
const asyncHandler = require("express-async-handler");
const enquiry = require("../../models/enquiry_model");
const { success } = require("../../utils/response");
const BaseController = require("../base_controller");
class EnquiryController extends BaseController {
  constructor() {
    super();
    this.model = enquiry;
    this.router = express.Router();
    this.router.get("/", asyncHandler(this.getAll.bind(this)));
  }

  async getAll(req, res) {
    const { company_code } = req.admin;
    const check = await this.find(this.model, { company_code: company_code }, {}, {});
    success(res, 200, true, "Get Successfully", check);
  }
}

module.exports = new EnquiryController().router;
