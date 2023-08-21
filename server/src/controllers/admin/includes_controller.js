const express = require("express");
const asyncHandler = require("express-async-handler");
const includes = require("../../models/includes_model");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateid");
const BaseController = require("../base_controller");
class IncludesController extends BaseController {
  constructor() {
    super();
    this.model = includes;
    this.router = express.Router();
    this.router.put("/",asyncHandler(this.updateHandler.bind(this)));
    this.router.get("/", asyncHandler(this.getAll.bind(this)));
  }

  async updateHandler(req, res) {
    const { company_code } = req.admin;
    const check = await this.findOne(this.model, { company_code: company_code }, {}, {});
    if (!check) {
      const updatedData = await this.create(this.model, {...req.body,company_code: company_code});
      success(res, 200, true, "Update Successfully", updatedData);
    } else {
    const updatedData = await this.update(this.model, { company_code: company_code }, {...req.body}, {new: true});
      success(res, 200, true, "Update Successfully", updatedData);
    }
  }

  async getAll(req, res) {
    const { company_code } = req.admin;
    const check = await this.find(this.model, { company_code: company_code }, {}, {});
    success(res, 200, true, "Get Successfully", check);
  }
}

module.exports = new IncludesController().router;
