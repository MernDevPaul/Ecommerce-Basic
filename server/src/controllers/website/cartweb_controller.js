const express = require("express");
const asyncHandler = require("express-async-handler");
const cart = require("../../models/cart_model");
const product = require("../../models/product_model");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateid");
const mongoose = require("mongoose");
const BaseController = require("../base_controller");
class BannerController extends BaseController {
  constructor() {
    super();
    this.model = cart;
    this.product = product;
    this.router = express.Router();
    this.router.post("/", asyncHandler(this.createHandler.bind(this)));
    this.router.put("/:id", asyncHandler(this.updateHandler.bind(this)));
    this.router.delete("/:id", asyncHandler(this.deleteHandler.bind(this)));
    this.router.delete("/", asyncHandler(this.deleteManyHandler.bind(this)));
    this.router.get("/:id", asyncHandler(this.getSingle.bind(this)));
    this.router.get("/", asyncHandler(this.getAll.bind(this)));
  }

  async createHandler(req, res) {
    const { company_code, _id } = req.buyer;
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) throw new Error("Product ID and Qty is required");
    const check_pro = await this.findOne(this.product, { _id: product_id }, {}, {});
    if (!check_pro) throw new Error("Product ID is invalid");
    const check_cart = await this.findOne(this.model, { product_id: product_id, buyer_id: _id, company_code: company_code }, {}, {});
    if(check_cart) throw new Error("Product already in cart");
    const createdData = await this.create(this.model, {
      ...req.body,
      company_code: company_code,
      buyer_id: _id,});
    success(res, 201, true, "Create Successfully", createdData);
  }
  async updateHandler(req, res) {
    const { id } = req.params;
    const { type } = req.body;
    validateId(id);
    const check = await this.findOne(this.model, { _id: id }, {}, {});
    if (!check) throw new Error("Not found");
    let form_data;
    if (type === "plus") {
      form_data = {$inc:{quantity:1}};
    } else if (type === "minus") {
      if (check?.quantity <= 1) {
        form_data = { $set: { quantity: 1 } };
      } else {
        form_data = { $inc: { quantity: -1 } };
      }
    } else {
      throw new Error("Invalid type");
    }
    
    const updatedData = await this.update(this.model, { _id: id }, form_data, {new: true});
    success(res, 200, true, "Update Successfully", updatedData);
  }
  async deleteHandler(req, res) {
    const { id } = req.params;
    validateId(id);
    const check = await this.findOne(this.model, { _id:id }, {}, {});
    if (!check) throw new Error("Not found");
    const deletedData = await this.delete(this.model, { _id: id });
    success(res, 200, true, "Delete Successfully", deletedData);
  }
  async deleteManyHandler(req, res) {
    const { ids } = req.body;
    const objectIdsToDelete = ids.map((id) => new mongoose.Types.ObjectId(id));
    const deletedData = await this.deleteMany(this.model, { _id: {$in:objectIdsToDelete} });
    success(res, 200, true, "Delete Successfully", deletedData);
  }
  async getSingle(req, res) {
    const { company_code, _id } = req.buyer;
    const { id } = req.params;
    validateId(id);
    const check = await this.findOne(this.model, { product_id: id,company_code: company_code, buyer_id: _id }, {}, {});
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", check);
  }

  async getAll(req, res) {
    const check = await this.cartService(req);
    success(res, 200, true, "Get Successfully", check);
  }
}

module.exports = new BannerController().router;
