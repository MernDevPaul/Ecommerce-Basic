const express = require("express");
const asyncHandler = require("express-async-handler");
const paymentinfo = require("../../models/paymentinfo_model");
const company = require("../../models/companyprofile_model");
const delivery_address = require("../../models/deliveryaddress_model");
const cart = require("../../models/cart_model");
const order = require("../../models/order_module");
const orderlogs = require("../../models/orderlogs_model");
const { success } = require("../../utils/response");
const Razorpay = require("razorpay");
const BaseController = require("../base_controller");
class PaymentWebController extends BaseController {
  constructor() {
    super();
    this.model = paymentinfo;
    this.company = company;
    this.delivery_address = delivery_address;
    this.cart = cart;
    this.order = order;
    this.orderlogs = orderlogs;
    this.router = express.Router();
    this.router.post("/create", asyncHandler(this.createHandler.bind(this)));
    this.router.post("/success", asyncHandler(this.successHandler.bind(this)));
    this.router.post("/fail", asyncHandler(this.failHandler.bind(this)));
  }

  async createHandler(req, res) {
    const { company_code, _id, name,email,phone } = req.buyer;
    const check_address = await this.findOne(this.delivery_address, { buyer_id: _id, company_code: company_code, is_default: true }, {}, {});
    if (!check_address && check_address === null) {
      throw new Error("Default address not available");
    }
    const company = await this.findOne(this.company, { company_code: company_code }, {}, {});
    if (!company) throw new Error("Payment option not available");
    if(!company?.payment_key && !company?.payment_secret) throw new Error("Payment details option not available");
    const cart = await this.cartService(req);
    const razorpay = new Razorpay({
      key_id: String(company.payment_key),
      key_secret: String(company.payment_salt),
    });
    const options = {
      amount: cart.grand_total * 100,
      currency: "INR",
      receipt: name,
    };
    const del_address = {
      name: check_address?.name,
      email: check_address?.email,
      phone: check_address?.phone,
      alternate_number: check_address?.alternate_number,
      address: check_address?.address,
      landmark: check_address?.landmark,
      country: check_address?.country,
      state: check_address?.state,
      city: check_address?.city,
      pincode: check_address?.pincode,
    };
    const cart_product = cart.product.map(async (item) => {
      return {
        product_id: item?.product_id?._id,
        product_name: item?.product_id?.product_name,
        quantity: item?.quantity,
        tax: item?.tax,
        tax_id: item?.tax_id,
        tax_persentage: item?.tax_persentage,
        discount_persentage: item?.discount_persentage,
        total_discount: item?.total_discount,
        total: (item?.total - item?.total_discount),
        mrp: item?.product_id?.mrp,
        sp: item?.product_id?.sp,
        image: item?.product_id?.image?.map((image) => image?.image_path),
      };
    });
    const products = await Promise.all(cart_product);

    try {
      const order = await razorpay.orders.create(options);
      const form_data = {
        company_code: company_code,
        buyer_id: _id,
        name: name,
        product: products,
        delivery_address: del_address,
        email: email,
        phone: phone,
        cart_total_quantity: cart.quantity,
        cart_sub_total: cart.total,
        cart_tax: cart.tax,
        cart_amount: cart.grand_total,
        cart_total_discount: cart.discount,
        payment_id: order.id,
        entity: order.entity,
        amount: order.amount,
        amount_paid: order.amount_paid,
        amount_due: order.amount_due,
        currency: "INR",
        receipt: order.receipt,
        offer_id: order.offer_id,
        status: order.status,
        attempts: order.attempts,
        notes: order.notes,
      };
      const createdData = await this.create(this.model, { ...form_data });
      success(res, 201, true, "Create Successfully", createdData);
    } catch (error) {
      throw new Error("Payment failed please try again later!");
    }
  }

  async successHandler(req, res) {
    const { company_code } = req.buyer;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, response } = req.body;
    const order = await this.findOne(this.model, { payment_id: razorpay_order_id }, {}, {});
    const company = await this.findOne(this.company, { company_code: company_code }, {}, {});
    if (!order) throw new Error("Order not found");
    const generate_order_no = await this.order
      .findOne({ company_code: company_code })
      .sort({ order_no: -1 });
    const generate_invoice_no = await this.order
      .findOne({ company_code: company_code })
      .sort({ invoice_no: -1 });
    const newOrderNo =
      generate_order_no?.order_no ? generate_order_no?.order_no + 1 : 1;
    const newInvoiceNo =
      generate_invoice_no?.invoice_no ? generate_invoice_no?.invoice_no + 1 : 1;
    if (order) {
      const form_data = {
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        razorpay_order_id: razorpay_order_id,
        payment_status: "success",
        payment_message: "Payment Success",
        response: response,
      };
      const company_details = {
        logo: company?.logo,
        address: company?.address,
        city: company?.city,
        company_name: company?.company_name,
        country: company?.country,
        email: company?.email,
        gst_in: company?.gst_in,
        landline: company?.landline,
        map: company?.map,
        pan_no: company?.pan_no,
        phone: company?.phone,
        pincode: company?.pincode,
        state: company?.state,
        website: company?.website,
      };
      const updatedData = await this.update(this.model, { payment_id: razorpay_order_id }, { ...form_data }, { new: true });
      const create_order = {
        company_code: company_code,
        buyer_id: updatedData.buyer_id,
        name: updatedData.name,
        product: updatedData.product,
        delivery_address: updatedData.delivery_address,
        email: updatedData.email,
        phone: updatedData.phone,
        cart_total_quantity: updatedData.cart_total_quantity,
        cart_sub_total: updatedData.cart_sub_total,
        cart_tax: updatedData.cart_tax,
        cart_amount: updatedData.cart_amount,
        cart_total_discount: updatedData.cart_total_discount,
        company_details: company_details,
        response: updatedData.response,
        razorpay_payment_id: updatedData.razorpay_payment_id,
        razorpay_signature: updatedData.razorpay_signature,
        razorpay_order_id: updatedData.razorpay_order_id,
        payment_status: updatedData.payment_status,
        payment_message: updatedData.payment_message,
        payment_info: updatedData._id,
        order_status: "Pending",
        order_no: newOrderNo,
        invoice_no: newInvoiceNo,
      };
      if (updatedData) {
        const place_order = await this.create(this.order, { ...create_order });
        await this.create(this.orderlogs, {
          order_id: place_order._id,
          order_status: place_order?.order_status,
        });
        await this.deleteMany(this.cart, {
          buyer_id: { $in: updatedData.buyer_id },
        });
        success(res, 200, true, "Order Placed Successfully", place_order);
      } else {
        throw new Error("Payment failed please try again later!");
      }
    }
  }

  async failHandler(req, res) {
    const { message, razorpay_payment_id, razorpay_order_id } = req.body;
    const form_data = {
      razorpay_payment_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id,
      payment_status: "failed",
      payment_message: message,
    };
    const updatedData = await this.update(this.model, { payment_id: razorpay_order_id }, { ...form_data }, { new: true });
    if(updatedData) {
      success(res, 200, true, "Payment Failed", updatedData);
    }
  }
  
}

module.exports = new PaymentWebController().router;
