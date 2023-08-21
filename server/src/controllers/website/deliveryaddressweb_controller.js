const express = require("express");
const asyncHandler = require("express-async-handler");
const deliveryaddress = require("../../models/deliveryaddress_model");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateid");
const mongoose = require("mongoose");
const BaseController = require("../base_controller");
class DeliveryAddressController extends BaseController {
  constructor() {
    super();
    this.model = deliveryaddress;
    this.router = express.Router();
    this.router.post("/", asyncHandler(this.createHandler.bind(this)));
    this.router.put("/:id", asyncHandler(this.updateHandler.bind(this)));
    this.router.put("/", asyncHandler(this.updateDefaultHandler.bind(this)));
    this.router.delete("/:id", asyncHandler(this.deleteHandler.bind(this)));
    this.router.delete("/", asyncHandler(this.deleteManyHandler.bind(this)));
    this.router.get("/:id", asyncHandler(this.getSingle.bind(this)));
    this.router.get("/", asyncHandler(this.getAll.bind(this)));
  }

  async createHandler(req, res) {
    req.body.company_code = req.headers.company_code;
    req.body.is_default = false;
    const createdData = await this.create(this.model, {...req.body});
    success(res, 201, true, "Create Successfully", createdData);
  }
  async updateHandler(req, res) {
    const { id } = req.params;
    validateId(id);
    const check = await this.findOne(this.model, { _id: id }, {}, {});
    if (!check) throw new Error("Not found");
    req.body.is_default = check.is_default;
    const updatedData = await this.update(this.model, { _id: id }, {...req.body}, {new: true});
    success(res, 200, true, "Update Successfully", updatedData);
  }
  async updateDefaultHandler(req, res) {
    const { id } = req.body;
    validateId(id);
    const check = await this.find(this.model, { buyer_id: req.body.buyer_id }, {}, {});
    if (!check) throw new Error("Not found");
    await this.updateMany(this.model, { buyer_id: req.body.buyer_id }, {is_default: false}, {new: true});
    const updatedData = await this.update(this.model, { _id: id }, {is_default: true}, {new: true});
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
    const { company_code,_id } = req.buyer;
    const { id } = req.params;
    validateId(id);
    const check = await this.findOne(
      this.model,
      { _id: id, company_code: company_code, buyer_id: _id },
      {},
      {}
    );
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", check);
  }

  async getAll(req, res) {
    const { company_code,_id } = req.buyer;
    const check = await this.find(
      this.model,
      { company_code: company_code, buyer_id: _id },
      {},
      {}
    );
    success(res, 200, true, "Get Successfully", check);
  }
}

module.exports = new DeliveryAddressController().router;
