const express = require("express");
const asyncHandler = require("express-async-handler");
const socialmedia = require("../../models/social_media");
const { success } = require("../../utils/response");
const BaseController = require("../base_controller");
class SocialMediaWebController extends BaseController {
  constructor() {
    super();
    this.model = socialmedia;
    this.router = express.Router();
    this.router.get("/", asyncHandler(this.getAll.bind(this)));
  }

  async getAll(req, res) {
    const { company_code } = req.headers;
    const check = await this.find(this.model, { company_code: company_code,status: true }, {}, {});
    success(res, 200, true, "Get Successfully", check);
  }
}

module.exports = new SocialMediaWebController().router;
