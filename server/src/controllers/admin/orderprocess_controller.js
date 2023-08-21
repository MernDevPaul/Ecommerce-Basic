const express = require("express");
const asyncHandler = require("express-async-handler");
const order = require("../../models/order_module");
const orderlogs = require("../../models/orderlogs_model");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateid");
const mongoose = require("mongoose");
const BaseController = require("../base_controller");
class OrderController extends BaseController {
  constructor() {
    super();
    this.model = order;
    this.orderlogs = orderlogs;
    this.router = express.Router();
    this.router.put("/:id", asyncHandler(this.updateHandler.bind(this)));
    this.router.get("/:id", asyncHandler(this.getSingle.bind(this)));
    this.router.get("/", asyncHandler(this.getAll.bind(this)));
  }

  async updateHandler(req, res) {
    const { id } = req.params;
    validateId(id);
    const { order_status } = req.body;
    await this.statusCheck(order_status);
    const check = await this.findOne(this.model, { _id: id }, {}, {});
    if (!check) throw new Error("Not found");
    const order_log_check = await this.findOne(this.orderlogs, { order_id: id, order_status: order_status }, {}, {});
    if (order_log_check) throw new Error("Order status already updated");
    if (order_status === "Cancelled") {
      const delivery_check = await this.findOne(this.orderlogs, { order_id: id, order_status: "Delivered" }, {}, {});
      if(delivery_check) throw new Error("This changes are not allowed");
    }
    const cancel_check = await this.findOne(this.orderlogs, { order_id: id, order_status: "Cancelled" }, {}, {});
      if (cancel_check) throw new Error("This changes are not allowed");
    const updatedData = await this.update(this.model, { _id: id }, { $set: { order_status: order_status } }, { new: true });
    await this.create(this.orderlogs, { order_id: id, order_status: order_status });
    success(res, 200, true, "Update Successfully", updatedData);
  }
  async getSingle(req, res) {
    const { company_code } = req.admin;
    const { id } = req.params;
    const options = {};
    options.populate = "buyer_id";
    validateId(id);
    const check = await this.findOne(this.model, { _id: id, company_code: company_code }, {}, {options});
    const order_log = await this.find(this.orderlogs, { order_id: id }, {}, {});
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", {
      order: check,
      order_logs: order_log,
    });
  }

  async getAll(req, res) {
    const { buyer_id, product_id, min, max, date } = req.query;
    const options = {
      populate: "buyer_id",
      sort: { order_no: -1 },
    };
    const { company_code } = req.admin;
    const filter = { company_code: company_code };

    if (buyer_id) {
      filter["buyer_id"] = new mongoose.Types.ObjectId(buyer_id);
    }

    if (product_id) {
      filter["product.product_id"] = new mongoose.Types.ObjectId(product_id);
    }

    if (min) {
      filter["cart_amount"] = { $gte: parseFloat(min) };
    }

    if (max) {
      filter["cart_amount"] = {...filter["cart_amount"],$lte: parseFloat(max) };
    }

    if (date) {
      filter["created_at"] = {
        $gte: new Date(date[0]),
        $lte: new Date(date[1]),
      };
    }
    const check = await this.find(this.model, filter, {}, options);
    const ress = await Promise.all(
      check.map(async (item) => {
        const order_log = await this.find(this.orderlogs, { order_id: item._id }, {}, {});
        return {
          order: item,
          order_logs: order_log,
        };
      })
    );
    success(res, 200, true, "Get Successfully", ress);
  }
}

module.exports = new OrderController().router;
