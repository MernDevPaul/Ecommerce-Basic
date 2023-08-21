const express = require("express");
const asyncHandler = require("express-async-handler");
const blog = require("../../models/blog_model");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateid");
const mongoose = require("mongoose");
const slugify = require("slugify");
const BaseController = require("../base_controller");
class BlogController extends BaseController {
  constructor() {
    super();
    this.model = blog;
    this.router = express.Router();
    this.router.post("/", this.uploadSingle('image'), asyncHandler(this.createHandler.bind(this)));
    this.router.put("/:id", this.uploadSingle('image'), asyncHandler(this.updateHandler.bind(this)));
    this.router.delete("/:id", asyncHandler(this.deleteHandler.bind(this)));
    this.router.delete("/", asyncHandler(this.deleteManyHandler.bind(this)));
    this.router.get("/:id", asyncHandler(this.getSingle.bind(this)));
    this.router.get("/", asyncHandler(this.getAll.bind(this)));
  }

  async createHandler(req, res) {
    req.body.company_code = req.admin.company_code;
    var _a;
    const check = await this.findOne(this.model, { title: req.body.title, company_code: req.body.company_code }, {}, {});
    if (check) throw new Error("Blog Name Already exists");
    req.body.slug = slugify(req?.body?.title, {
      lower: true,
      trim: true,
    });
    const createdData = await this.create(this.model, {...req.body,image:(_a = req.file) === null || _a === void 0 ? void 0 : _a.path});
    success(res, 201, true, "Create Successfully", createdData);
  }
  async updateHandler(req, res) {
    var _a;
    const { id } = req.params;
    validateId(id);
    const check = await this.findOne(this.model, { _id: id }, {}, {});
    if (!check) throw new Error("Not found");
    req.body.slug = slugify(req?.body?.title, {
      lower: true,
      trim: true,
    });
    const updatedData = await this.update(this.model, { _id: id }, {...req.body,image:(_a = req.file) === null || _a === void 0 ? void 0 : _a.path}, {new: true});
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
    options.populate = "category tags";
    const { company_code } = req.admin;
    const { id } = req.params;
    validateId(id);
    const check = await this.findOne(this.model, { _id: id,company_code: company_code }, {}, {options});
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", check);
  }

  async getAll(req, res) {
    const options = {};
    options.populate = "category tags";
    const { company_code } = req.admin;
    const check = await this.find(this.model, { company_code: company_code }, {}, {options});
    success(res, 200, true, "Get Successfully", check);
  }
}

module.exports = new BlogController().router;
