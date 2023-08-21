const express = require("express");
const api = express.Router();

api
  .use(
    "/mastersettings",
    require("../controllers/admin/mastersettings_controller")
  )
  .use("/company", require("../controllers/admin/company_controller"))
  .use("/staff", require("../controllers/admin/staff_controller"))
  .use("/tax", require("../controllers/admin/tax_controller"))
  .use("/product", require("../controllers/admin/product_controller"))
  .use("/banner", require("../controllers/admin/banner_controller"))
  .use("/buyer", require("../controllers/admin/buyer_controller"))
  .use("/blogs", require("../controllers/admin/blog_controller"))
  .use("/pages", require("../controllers/admin/pages_controller"))
  .use("/webmenus", require("../controllers/admin/webmenus_controller"))
  .use("/includes", require("../controllers/admin/includes_controller"))
  .use("/order", require("../controllers/admin/orderprocess_controller"))
  .use("/enquiry", require("../controllers/admin/enquiry_controller"))
  .use("/socialmedia", require("../controllers/admin/socialmedia_controller"));

module.exports = api;
