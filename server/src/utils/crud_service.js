const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const tax = require("../models/tax_model");
const product = require("../models/product_model");
const cart = require("../models/cart_model");
class CrudService {
  constructor() {
    this.jwt = jwt;
    this.tax = tax;
    this.product = product;
    this.cart = cart;
  }

  async create(model, data) {
    return await model.create(data);
  }

  async createMany(model, data) {
    return await model.insertMany(data);
  }

  async update(model, conditions, update, options) {
    return await model.findOneAndUpdate(conditions, update, options);
  }

  async updateById(model, id, update, options) {
    return await model.findByIdAndUpdate(id, update, options);
  }

  async updateMany(model, conditions, update, options) {
    return await model.updateMany(conditions, update, options);
  }

  async delete(model, conditions) {
    return await model.findOneAndDelete(conditions);
  }

  async deleteById(model, id) {
    return await model.findByIdAndDelete(id);
  }

  async deleteMany(model, conditions) {
    return await model.deleteMany(conditions);
  }

  async findOne(model, query, projection, extension) {
    const { options, populate } = extension;
    return await model
      .findOne(query, projection, options)
      .populate(populate)
      .exec();
  }

  async findOneById(model, id, projection, extension) {
    const { options, populate } = extension;
    return await model
      .findById(id, projection, options)
      .populate(populate)
      .exec();
  }

  async find(model, query, projection, extension) {
    const { populate, sort, limit, options, count } = extension;
    let queryObj = model.find(query, projection, options);
    if (populate) queryObj = queryObj.populate(populate);
    if (sort) queryObj = queryObj.sort(sort);
    if (limit) queryObj = queryObj.limit(limit);

    const execQuery = queryObj.exec();
    if (count) {
      const countResult = this.model.countDocuments(query);
      return Promise.all([execQuery, countResult]).then(([data, count]) => ({
        data,
        count,
      }));
    }

    return execQuery;
  }

  async getAggregation(model, query, extension) {
    const { populate } = extension;
    let aggregation = model.aggregate(query);
    if (populate) aggregation = aggregation.populate({ path: populate });
    return aggregation.exec();
  }

  async getCount(model, conditions) {
    return await model.countDocuments(conditions);
  }

  async generateToken(id) {
    return this.jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  }

  async upload() {
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/uploads");
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + Math.random() + path.extname(file.originalname));
      },
    });
    let upload = multer({ storage: storage });
    return upload.single("image");
  }

  uploadSingle(image) {
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/uploads");
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + Math.random() + path.extname(file.originalname));
      },
    });
    let upload = multer({ storage: storage });
    return upload.single(image);
  }

  uploadMultiple(image) {
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/uploads");
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + Math.random() + path.extname(file.originalname));
      },
    });
    let upload = multer({ storage: storage });
    return upload.array(image);
  }

  async cartService(req) {
    const options = {};
    const { company_code, _id } = req.buyer;
    options.populate = "product_id buyer_id";
    const cartQuery = { company_code: company_code, buyer_id: _id };
    const cart_list = await this.find(this.cart, cartQuery, {}, { options });

    const calculateTax = (sp, mrp, tax) => ((sp || mrp) * tax) / 100;
    const calculateTotal = (sp, mrp, quantity) => (sp || mrp) * quantity;

    const productPromises = cart_list.map(async (cartItem) => {
      const get_tax = await this.findOne(
        this.tax,
        { _id: cartItem.product_id.tax },
        {},
        {}
      );
      const { sp, mrp } = cartItem.product_id;

      return {
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        tax: Math.round(calculateTax(sp, mrp, get_tax?.tax_persentage)),
        tax_id: get_tax?._id,
        tax_persentage: get_tax?.tax_persentage,
        discount_persentage: cartItem?.product_id?.discount,
        total_discount: Math.round(
          ((cartItem?.product_id?.discount||0) / 100) *
            Math.round(calculateTotal(sp, mrp, cartItem.quantity))
        ),
        total: Math.round(calculateTotal(sp, mrp, cartItem.quantity)),
        _id: cartItem._id,
      };
    });

    const products = await Promise.all(productPromises);

    const final_total = products.reduce(
      (total, product) => total + product.total,
      0
    );
    const final_tax = products.reduce(
      (totalTax, product) => totalTax + product.tax,
      0
    );
    const final_quantity = products.reduce(
      (totalQuantity, product) => totalQuantity + product.quantity,
      0
    );
    const total_discount = products.reduce(
      (totalDiscount, product) => totalDiscount + product.total_discount,
      0
    );

    return {
      product: products,
      total: Math.round(final_total),
      tax: Math.round(final_tax),
      discount: Math.round(total_discount),
      quantity: final_quantity,
      grand_total: Math.round(final_total - total_discount + final_tax),
    };
  }

  async statusCheck(status) {
    switch (status) {
      case "Pending":
        return "Pending";
      case "Packing":
        return "Packing";
      case "Billed":
        return "Billed";
      case "Dispatched":
        return "Dispatched";
      case "Delivered":
        return "Delivered";
      case "Cancelled":
        return "Cancelled";
      default:
        throw new Error("Invalid Status");
    }
  }


}

module.exports = CrudService;
