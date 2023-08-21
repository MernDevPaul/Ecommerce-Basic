const express = require("express");
const asyncHandler = require("express-async-handler");
const buyer = require("../../models/buyer_model");
const BaseController = require("../base_controller");
const { success,successToken } = require("../../utils/response");
const validateId = require("../../utils/validateid");
const {authVerifyWeb} = require("../../utils/authentication")
class BuyerWebController extends BaseController {
  constructor() {
    super();
    this.model = buyer;
    this.router = express.Router();
    this.router.post(
      "/register",
      asyncHandler(this.registerHandler.bind(this))
    );
    this.router.post("/login", asyncHandler(this.loginHandler.bind(this)));
    this.router.put(
      "/profile/:id",
      authVerifyWeb,
      this.uploadSingle("image"),
      asyncHandler(this.updateProfileHandler.bind(this))
    );
    this.router.get(
      "/profile",
      authVerifyWeb,
      asyncHandler(this.getProfileHandler.bind(this))
    );
    this.router.post(
      "/wishlist",
      authVerifyWeb,
      asyncHandler(this.addWishListHandler.bind(this))
    );
    this.router.put(
      "/wishlist",
      authVerifyWeb,
      asyncHandler(this.removeWishListHandler.bind(this))
    );
    this.router.get(
      "/wishlist",
      authVerifyWeb,
      asyncHandler(this.getWishListHandler.bind(this))
    );
  }
  //admin register
  async registerHandler(req, res) {
    const { email, phone } = req.body;
    req.body.company_code = req.headers.company_code;
    const check_email = await this.findOne(
      this.model,
      { email: email },
      {},
      {}
    );
    const check_phone = await this.findOne(
      this.model,
      { phone: phone },
      {},
      {}
    );
    if (check_email) throw new Error("Email address already exists");
    if (check_phone) throw new Error("Phone number already exists");
    const createdData = await this.create(this.model, req.body);
    const token = await this.generateToken(createdData?._id);
    successToken(res, 201, true, "Register Successfully", null, token);
  }
  //admin login
  async loginHandler(req, res) {
    const { phone, password } = req.body;
    const check = await this.findOne(
      this.model,
      { phone: phone },
      { password: 1 },
      {}
    );
    if (!check) throw new Error("User not found");
    if (check.password != password) throw new Error("Invalid password");
    const token = await this.generateToken(check?._id);
    successToken(res, 200, true, "Login Successfully", null, token);
  }

  //update profile handler
  async updateProfileHandler(req, res) {
    const { id } = req.params;
    var _a;
    validateId(id);
    const { company_code } = req.headers;
    const form_data = { ...req.body };
    delete form_data.phone;
    delete form_data.email;
    delete form_data.is_blocked;
    delete form_data.totalpurchase_amount;
    delete form_data.status;
    delete form_data.totalpurchase_quantity;
    delete form_data.company_code;
    const check = await this.findOne(
      this.model,
      { _id: id, company_code: company_code },
      {},
      {}
    );
    if (!check) throw new Error("Not found");
    const updatedData = await this.update(
      this.model,
      { _id: id, company_code: company_code },
      {
        $set: {
          ...form_data,
          image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
        },
      },
      { new: true }
    );
    success(res, 200, true, "Update Successfully", updatedData);
  }

  //get profile handler
  async getProfileHandler(req, res) {
    const { _id } = req.buyer;
    const { company_code } = req.headers;
    const check = await this.findOne(
      this.model,
      { _id: _id, company_code: company_code },
      {
        password: 0,
        is_blocked: 0,
        totalpurchase_amount: 0,
        totalpurchase_quantity: 0,
      },
      {}
    );
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", check);
  }

  async addWishListHandler(req, res) {
    const { _id } = req.buyer;
    const { id } = req.body;
    validateId(id);
    const result = await this.update(
      this.model,
      { _id: _id },
      { $addToSet: { wishlist: id } },
      { new: true }
    );
    success(res, 200, true, "Add Successfully", result);
  }

  async removeWishListHandler(req, res) {
    const { _id } = req.buyer;
    const { id } = req.body;
    validateId(id);
    const result = await this.update(
      this.model,
      { _id: _id },
      { $pull: { wishlist: id } },
      { new: true }
    );
    console.log("result", result);
    success(res, 200, true, "Remove Successfully", result);
  }

  async getWishListHandler(req, res) {
    const options = {};
    options.populate = "wishlist";
    const { _id } = req.buyer;
    const result = await this.findOne(this.model, { _id: _id }, {}, { options });
    console.log("result", result);
    success(res, 200, true, "Get Successfully", {wishlist:result?.wishlist});
  }
}


module.exports = new BuyerWebController().router;