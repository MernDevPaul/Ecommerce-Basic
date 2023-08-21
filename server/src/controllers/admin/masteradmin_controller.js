const express = require("express");
const asyncHandler = require("express-async-handler");
const master_admin = require("../../models/masteradmin_model");
const company_profile = require("../../models/companyprofile_model");
const BaseController = require("../base_controller");
const { success,successToken } = require("../../utils/response");
const validateId = require("../../utils/validateid");
const mongoose = require("mongoose");

class MasterAdminController extends BaseController {
  constructor() {
    super();
    this.model = master_admin;
    this.company_profile = company_profile;
    this.router = express.Router();
    this.router.post("/register", asyncHandler(this.registerHandler.bind(this)));
    this.router.post("/login", asyncHandler(this.loginHandler.bind(this)));
  }
  //admin register
  async registerHandler(req, res) {
    const { email, phone } = req.body;
    req.body.company_code = new mongoose.Types.ObjectId();
    const check_email = await this.findOne(this.model, { email: email }, {}, {});
    const check_phone = await this.findOne(this.model, { phone: phone }, {}, {});
    const check_company = await this.findOne(this.model, { company_code: req.body.company_code }, {}, {});
    if (check_email) throw new Error("Email address already exists");
    if (check_phone) throw new Error("Phone number already exists");
    if (check_company) throw new Error("Company code already exists");
    const createdData = await this.create(this.model, req.body);
    await this.create(this.company_profile, {
      admin_id: createdData?._id,
      company_code: req.body.company_code
    });
    const token = await this.generateToken(createdData?._id);
    successToken(res, 201, true, "Register Successfully", null, token);
  }
  //admin login
  async loginHandler(req, res) {
    const { phone, password } = req.body;
    const check = await this.findOne(this.model, { phone: phone }, {password: 1}, {});
    if (!check) throw new Error("User not found");
    if (check.password != password) throw new Error("Invalid password");
    const token = await this.generateToken(check?._id);
    successToken(res, 200, true, "Login Successfully", null, token);
  }
}


module.exports = new MasterAdminController().router;