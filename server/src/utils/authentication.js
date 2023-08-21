const master_admin = require("../models/masteradmin_model");
const buyer = require("../models/buyer_model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authVerify = (authtype) =>
  asyncHandler(async (req, res, next) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("There is no token attached to the header");
    }
    if (authtype === "admin") {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin_check = await master_admin.findById(decoded?.id);

        if (!admin_check) {
          throw new Error("Not Authorized, invalid token");
        }

        req.admin = admin_check;
        req.body.company_code = admin_check?.company_code;
        req.query.company_code = admin_check?.company_code;

        next();
      } catch (error) {
        throw new Error("Not Authorized, token expired or invalid");
      }
    } else {
      throw new Error("Not Authorized");
    }
  });

const authCompany = asyncHandler(async (req, res, next) => {
  const company_code = req.headers.company_code;
  if(!company_code) throw new Error("Company code is required!")
  const check = await master_admin.findOne({ company_code: company_code });
  if (check) {
    next();
  } else {
    throw new Error("Company not found");
  }
})


const authVerifyWeb = asyncHandler(async (req, res, next) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("There is no token attached to the header");
    }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const buyer_check = await buyer.findById(decoded?.id);

        if (!buyer_check) {
          throw new Error("Not Authorized, invalid token");
        }

        req.buyer = buyer_check;
        req.body.company_code = buyer_check?.company_code;
        req.body.buyer_id = buyer_check?._id;
        

        next();
      } catch (error) {
        throw new Error("Not Authorized, token expired or invalid");
      }
    
  });

module.exports = { authVerify, authCompany, authVerifyWeb };
