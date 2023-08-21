const express = require("express");
const routes = express.Router();
const admin_url = "/api/v1/admin";
const web_url = "/api/v1/web";
const { authVerify,authCompany } = require("../utils/authentication");

routes
  //admin routes
  .use(admin_url + "/", require("../controllers/admin/masteradmin_controller"))
  .use(admin_url, authVerify("admin"), require("./admin_route"))
  //web routes
  .use(web_url,authCompany, require("./website_route"));
module.exports = routes;
