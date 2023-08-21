const express = require("express");
const asyncHandler = require("express-async-handler");
const review = require("../../models/reviews_model");
const order = require("../../models/order_module");
const { success } = require("../../utils/response");
const BaseController = require("../base_controller");
const {authVerifyWeb} = require("../../utils/authentication")
const mongoose = require("mongoose");
class ReviewWebController extends BaseController {
  constructor() {
    super();
    this.model = review;
    this.order = order;
    this.router = express.Router();
    this.router.post("/", authVerifyWeb,asyncHandler(this.createHandler.bind(this)));
  }

  async createHandler(req, res) {
    const { _id } = req.buyer;
    const { product_id } = req.body;
    req.body.company_code = req.headers.company_code;
    const check_purshase = await this.findOne(
      this.order,
      {
        product: {
          $elemMatch: { product_id: new mongoose.Types.ObjectId(product_id) },
        },
        buyer_id: _id,
        company_code: req.headers.company_code,
      },
      {},
      {}
    );
    if(!check_purshase) {
      throw new Error("After Purchase will able to submit review");
    }
    const check_review = await this.findOne(this.model, { product_id: new mongoose.Types.ObjectId(product_id), buyer_id: _id, company_code: req.headers.company_code }, {}, {});
    if(check_review) throw new Error("Product already in review");
    const createdData = await this.create(this.model, { ...req.body });
    success(res, 201, true, "Submit Successfully", createdData);
  }

}

module.exports = new ReviewWebController().router;
