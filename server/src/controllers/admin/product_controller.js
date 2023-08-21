const express = require("express");
const asyncHandler = require("express-async-handler");
const products = require("../../models/product_model");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateid");
const mongoose = require("mongoose");
const slugify = require("slugify");
const BaseController = require("../base_controller");
class ProductsController extends BaseController {
  constructor() {
    super();
    this.model = products;
    this.router = express.Router();
    this.router.post("/", this.uploadMultiple('image'), asyncHandler(this.createHandler.bind(this)));
    this.router.put("/:id", this.uploadMultiple('image'), asyncHandler(this.updateHandler.bind(this)));
    this.router.delete("/:id", asyncHandler(this.deleteHandler.bind(this)));
    this.router.delete("/", asyncHandler(this.deleteManyHandler.bind(this)));
    this.router.get("/:id", asyncHandler(this.getSingle.bind(this)));
    this.router.get("/", asyncHandler(this.getAll.bind(this)));
  }

  async createHandler(req, res) {
    req.body.company_code = req.admin.company_code;
    req.body.slug = slugify(req?.body?.product_name, {
      lower: true,
      trim: true,
    });
    req.body.slug = req.body.slug.replace(/[,"'()]/g, "");
    let img = req.files;
    let images = img === null || img === void 0 ? void 0 : img.map((e) => { return {image_path:e.path} });
    const check = await this.findOne(this.model, { product_name: req.body.product_name, company_code: req.body.company_code, slug: req.body.slug }, {}, {});
    const check_sku = await this.findOne(this.model, { sku: req.body.sku,company_code: req.body.company_code}, {}, {});
    if (check) throw new Error("Product Already exists");
    if (check_sku) throw new Error("SKU Already exists");
    const createdData = await this.create(this.model, {...req.body,image:images});
    success(res, 201, true, "Create Successfully", createdData);
  }
  async updateHandler(req, res) {
    const { id } = req.params;
    validateId(id);
    //remove image
    if (req?.body?.image_type === "remove") {
      const updatedData = await this.update(this.model, { _id: id }, {$pull: {image: {_id: req.body.image_id}}}, {new: true});
      success(res, 200, true, "Remove Successfully", updatedData);
    }
    //normal update
    let img = req.files;
    let images = img === null || img === void 0 ? void 0 : img.map((e) => { return {image_path:e.path} });
    req.body.slug = slugify(req?.body?.product_name, {
      lower: true,
      trim: true,
    });
    req.body.slug = req.body.slug.replace(/[,"'()]/g, "");
    const check = await this.findOne(this.model, { _id: id }, {}, {});
    if (!check) throw new Error("Not found");
    check.image.forEach(element => {
      images.push({
        image_path:element.image_path,
      })
    });
    const updatedData = await this.update(this.model, { _id: id }, {...req.body,image:images}, {new: true});
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
    const options = {};
    options.populate = "category brand tax tags";
    const { company_code } = req.admin;
    const { id } = req.params;
    validateId(id);
    const check = await this.findOne(this.model, { _id: id,company_code: company_code }, {}, {options});
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", check);
  }

  async getAll(req, res) {
    const options = {};
    options.populate = 'category brand tax tags';
    const { company_code } = req.admin;
    const check = await this.find(this.model, { company_code: company_code }, {}, {options});
    success(res, 200, true, "Get Successfully", check);
  }
}

module.exports = new ProductsController().router;
