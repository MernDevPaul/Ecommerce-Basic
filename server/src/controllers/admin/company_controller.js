const express = require("express");
const asyncHandler = require("express-async-handler");
const company_profile = require("../../models/companyprofile_model");
const BaseController = require("../base_controller");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateid");

class CompanyProfileController extends BaseController {
  constructor() {
    super();
    this.company_profile = company_profile;
    this.router = express.Router();
    this.router.get("/", asyncHandler(this.getCompanyHandler.bind(this)));
    this.router.put("/:id", this.uploadSingle('logo'),asyncHandler(this.updateCompanyHandler.bind(this)));
  }
  //company get handler
  async getCompanyHandler(req, res) {
    const { company_code,_id } = req.admin;
    const check = await this.findOne(this.company_profile, { admin_id: _id,company_code:company_code }, {}, {});
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", check);
  }
  //company update handler
  async updateCompanyHandler(req, res) {
    var _a;
    const { company_code, _id } = req.admin;
    const { id } = req.params;
    validateId(id);
    const check = await this.findOne(this.company_profile, { _id: id }, {}, {});
    if (!check) throw new Error("Not found");
    const updatedData = await this.update(this.company_profile, { _id: id,admin_id: _id,company_code:company_code }, {...req.body,logo:(_a = req.file) === null || _a === void 0 ? void 0 : _a.path}, {new: true});
    success(res, 200, true, "Update Successfully", updatedData);
  }
}


module.exports = new CompanyProfileController().router;