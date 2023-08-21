const express = require("express");
const asyncHandler = require("express-async-handler");
const products = require("../../models/product_model");
const review = require("../../models/reviews_model");
const BaseController = require("../base_controller");
const { success } = require("../../utils/response");
const mongoose = require("mongoose");

class ProductWebController extends BaseController {
  constructor() {
    super();
    this.model = products;
    this.review = review;
    this.router = express.Router();
    this.router.get("/", asyncHandler(this.getHandler.bind(this)));

    this.router.get("/product/:slug", asyncHandler(this.getSingleHandler.bind(this)));

    this.router.get("/filter", asyncHandler(this.getFilterHandler.bind(this)));

  }
  //company getsingle handler
  async getSingleHandler(req, res) {
    const { slug } = req.params;
    const options = {};
    options.populate = "brand category tags tax";
    const { company_code } = req.headers;
    const check = await this.findOne(
      this.model,
      { slug: slug, company_code: company_code, status: true },
      {},
      { options }
    );
    const options1 = {};
    options1.populate = "buyer_id";

    const review = await this.review.find({ company_code: company_code, product_id: check?._id, status: true }).populate("buyer_id").exec();
    console.log("review", review);
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", { data: check, review: review });
  }
  //related product handler
  
  //company get handler
  async getHandler(req, res) {
    const options = {};
    options.populate = "brand category tags tax";
    const { company_code } = req.headers;
    const check = await this.find(
      this.model,
      { ...req.query, company_code: company_code, status: true },
      {},
      { options }
    );
    if (!check) throw new Error("Not found");
    success(res, 200, true, "Get Successfully", check);
  }
  async getFilterHandler(req, res) {
    console.log("company_code", "company_code");
    const { company_code } = req.headers;
    console.log("company_code", "company_code");
    const {
      category,
      brand,
      tags,
      lowtohigh,
      hightolow,
      page,
      limit,
      sort,
      search,
      newtoold,
      oldtonew,
      instock,
      outofstock,
      categoryname,
      brandname,
      tagsname,
      excludes,
      min,
      max,
    } = req.query;

    const aggregationPipeline = [];
    const aggregationPipeline1 = [];

    // Match Stage
    const matchStage = {
      $match: {
        company_code: new mongoose.Types.ObjectId(company_code),
        status: true,
      },
    };

    if (category)
      matchStage.$match.category = new mongoose.Types.ObjectId(category);
    if (brand) matchStage.$match.brand = new mongoose.Types.ObjectId(brand);
    if (tags) matchStage.$match.tags = new mongoose.Types.ObjectId(tags);
    if (search) matchStage.$match.$text = { $search: search };
    if (instock || outofstock) {
      const stockConditions = [];
      if (instock) {
        stockConditions.push({ stock_status: true });
      }
      if (outofstock) {
        stockConditions.push({ stock_status: false });
      }
      matchStage.$match.$or = stockConditions;
    }
    aggregationPipeline.push(matchStage);
    if (min) {
      aggregationPipeline.push({ $match: { mrp: { $gte: parseInt(min) } } });
    }
    if (max) {
      aggregationPipeline.push({ $match: { mrp: { $lte: parseInt(max) } } });
    }
    // Sorting
    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(":");
      sortOptions[field] = order === "asc" ? 1 : -1;
    } else if (lowtohigh) {
      sortOptions.mrp = 1;
    } else if (hightolow) {
      sortOptions.mrp = -1;
    } else if (newtoold) {
      sortOptions.created_at = -1;
    } else if (oldtonew) {
      sortOptions.created_at = 1;
    }

    if (Object.keys(sortOptions).length > 0) {
      aggregationPipeline.push({ $sort: sortOptions });
    }

    // Populate Stage
    aggregationPipeline.push(
      {
        $lookup: {
          from: "mastersettings",
          localField: "brand",
          foreignField: "_id",
          as: "brandDocs",
        },
      },
      {
        $lookup: {
          from: "mastersettings",
          localField: "category",
          foreignField: "_id",
          as: "categoryDocs",
        },
      },
      {
        $lookup: {
          from: "mastersettings",
          localField: "tags",
          foreignField: "_id",
          as: "tagsDocs",
        },
      }
    );

    if (categoryname) {
      aggregationPipeline.push({
        $match: {
          "categoryDocs.slug": categoryname,
        },
      });
    }
    if (brandname) {
      aggregationPipeline.push({
        $match: {
          "brandDocs.slug": brandname,
        },
      });
    }
    if (tagsname) {
      aggregationPipeline.push({
        $match: {
          "tagsDocs.slug": tagsname,
        },
      });
    }

    if (excludes) {
      const fields = excludes.split(",");
      const projectStage = {};

      for (const field of fields) {
        projectStage[field] = 0;
      }

      aggregationPipeline.push({ $project: projectStage });
    }
    const total = await this.getAggregation(
      this.model,
      aggregationPipeline,
      {}
    );

    // Pagination
    if (page && limit) {
      const skipValue = parseInt(page - 1) * parseInt(limit);
      aggregationPipeline.push({ $skip: skipValue });
      aggregationPipeline.push({ $limit: parseInt(limit) });
    }
    aggregationPipeline1.push({
      $facet: {
        products: aggregationPipeline,
        pricerange: [
          {
            $group: {
              _id: null,
              minPrice: { $min: "$mrp" },
              maxPrice: { $max: "$mrp" },
            },
          },
          {
            $project: {
              _id: 0,
              minPrice: 1,
              maxPrice: 1,
            },
          },
        ],
      },
    });
    aggregationPipeline1.push({
      $addFields: {
        total: total?.length,
      },
    });

    try {
      const result = await this.getAggregation(
        this.model,
        aggregationPipeline1,
        {}
      );

      success(res, 200, true, "Get Successfully", result);
    } catch (error) {
      throw new Error(error);
    }
  }
}


module.exports = new ProductWebController().router;