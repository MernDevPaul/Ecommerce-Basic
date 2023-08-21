import React, { useEffect, useCallback, useState } from "react";
import { Breadcrumb, Button, message, Empty } from "antd";
import MyAddress from "./MyAddress";
import API from "../Api/ApiService";
import { useDispatch, useSelector } from "react-redux";
import useRazorpay from "react-razorpay";
import Logo from "../Assets/Images/logo.png";
import {
  accountStart,
  accountSuccess,
  accountFailure,
} from "../Store/Slice/MyAccountSlice";
import { useNavigate } from "react-router-dom";
const Checkout = () => {
  const [Razorpay] = useRazorpay();
  const [loading, setLoading] = useState({
    payment:false,
  });
  const api = new API();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart_list = useSelector((state) => state?.account?.cartlist?.data);
  const company_list = useSelector((state) => state?.common?.companylist?.data);
  //initFunction
  const initFunction = async () => {
    await api.getAll(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "cartlist"],
      "cart",
      {},
      (err, res) => {}
    );
  };
  //init
  useEffect(() => {
    initFunction();
  }, []);

  const initiatePayment = useCallback(async () => {
    setLoading((prev) => ({ ...prev, payment: true }));
    const response = await api.create(
      dispatch,
      ["", "", "", ""],
      "payment/create",
      {},
      (err, res) => {
        setLoading((prev) => ({ ...prev, payment: false }));
        if (res) {
          const order = res?.data?.data;
          const options = {
            key: company_list?.payment_key,
            amount: order?.amount,
            currency: order?.currency,
            name: company_list?.company_name,
            description: company_list?.company_name,
            image: company_list?.logo
              ? `${api.apiUrl + company_list?.logo}`
              : Logo,
            order_id: order?.payment_id,
            handler: function (response, error) {
              paymentSuccess(response);
            },
            prefill: {
              name: order?.name,
              email: order?.email,
              contact: order?.phone,
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#131921",
            },
          };
          const rzpay = new Razorpay(options);
          rzpay.open();
          rzpay.on("payment.failed", function (response) {
            paymentFail(response);
          });
        } else {
          message.error(err.response.data.message);
        }
      }
    );
  }, [Razorpay]);

  const paymentSuccess = async (response) => {
    const form_data = {
      razorpay_order_id: response?.razorpay_order_id,
      razorpay_payment_id: response?.razorpay_payment_id,
      razorpay_signature: response?.razorpay_signature,
      response: response,
    };
    await api.create(
      dispatch,
      ["", "", "", ""],
      "payment/success",
      form_data,
      (err, res) => {
        if (res) {
          message.success(res.data.message);
          initFunction();
          navigate("/account/my-order");
        } else {
          message.error(err.response.data.message);
        }
      }
    );
  };

  const paymentFail = async (response) => {
    const form_data = {
      message: response?.error?.description,
      razorpay_payment_id: response?.error?.metadata?.payment_id,
      razorpay_order_id: response?.error?.metadata?.order_id,
    };
    await api.create(
      dispatch,
      ["", "", "", ""],
      "payment/fail",
      form_data,
      (err, res) => {
        if (res) {
          message.error(res.data.message);
          initFunction();
        } else {
          message.error(err.response.data.message);
        }
      }
    );
  };
  return (
    <>
      <div className="shop_breadcrumb">
        <div className="wrapper">
          <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "Checkout",
              },
            ]}
          />
        </div>
      </div>
      <div className="checkout_page_section">
        <div className="wrapper">
          <div className="checkout_align">
            <h1>Checkout</h1>
            {cart_list?.product?.length > 0 ? (
              <>
                <div className="checkout_left">
                  <MyAddress />
                </div>
                <div className="checkout_right">
                  <div className="payment_total">
                    <div className="payment_sub_total">
                      <b>Total Item{cart_list?.quantity <= 1 ? "" : "s"}:</b>{" "}
                      {cart_list?.quantity}
                    </div>
                    <div className="payment_sub_total">
                      <b>SubTotal:</b> {cart_list?.total}
                    </div>
                    <div className="payment_sub_total">
                      <b>Tax:</b> {cart_list?.tax}
                    </div>
                    <div className="payment_sub_total">
                      <b>Discount:</b>- {cart_list?.discount}
                    </div>

                    <div className="payment_sub_total">
                      <b>GrandTotal:</b>{" "}
                      {api.currency + " " + cart_list?.grand_total}
                    </div>
                  </div>
                  <div className="check_move_btn">
                    <Button
                      htmlType="button"
                      onClick={initiatePayment}
                      loading={loading?.payment}
                    >
                      Place Order
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
