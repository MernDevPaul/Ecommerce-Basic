const express = require("express");
const asyncHandler = require("express-async-handler");
const enquiry = require("../../models/enquiry_model");
const { success } = require("../../utils/response");
const BaseController = require("../base_controller");
class EnquiryWebController extends BaseController {
  constructor() {
    super();
    this.model = enquiry;
    this.router = express.Router();
    this.router.post("/", asyncHandler(this.createHandler.bind(this)));
  }

  async createHandler(req, res) {
    req.body.company_code = req.headers.company_code;
    const createdData = await this.create(this.model, {...req.body});
    success(res, 201, true, "Submit Successfully", createdData);
  }
  
}

module.exports = new EnquiryWebController().router;
