const express = require("express");
const api = express.Router();
const { authVerifyWeb} = require("../utils/authentication")

api
  .use("/", require("../controllers/website/buyerweb_controller"))
  .use("/company", require("../controllers/website/companyweb_controller"))
  .use("/mastersettings", require("../controllers/website/mastersettingsweb_controller"))
  .use("/banner", require("../controllers/website/bannerweb_controller"))
  .use("/webmenus", require("../controllers/website/webmenusweb_controller"))
  .use("/deliveryaddress", authVerifyWeb, require("../controllers/website/deliveryaddressweb_controller"))
  .use("/blog", require("../controllers/website/blogweb_controller"))
  .use("/productlist", require("../controllers/website/productweb_controller"))
  .use("/enquiry", require("../controllers/website/enquiryweb_controller"))
  .use("/cart", authVerifyWeb, require("../controllers/website/cartweb_controller"))
  .use("/payment", authVerifyWeb, require("../controllers/website/createpaymentweb_controller"))
  .use("/myorder", authVerifyWeb, require("../controllers/website/myorderweb_controller"))
  .use("/page", authVerifyWeb, require("../controllers/website/pagesweb_controller"))
  .use("/review", require("../controllers/website/reviewweb_controller"))
  .use("/social", require("../controllers/website/socialweb_controller"))

module.exports = api;