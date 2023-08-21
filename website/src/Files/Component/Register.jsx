import React, { useState } from "react";
import { Breadcrumb, Form, Input, Button, message } from "antd";
import { Link, Navigate } from "react-router-dom";
import API from "../Api/ApiService";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../Store/Slice/LoginSlice";
import { useDispatch } from "react-redux";
const Register = () => {
  const [loading, setLoading] = useState(false);
  const api = new API();
  const dispatch = useDispatch();
  const isAuthenticated = api.webtoken !== "" && Boolean(api.isbuyer) === true;
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  const onFinish = async (values) => {
     setLoading(true);
     await api.create(
       dispatch,
       [loginStart, loginSuccess, loginFailure, "register"],
       "register",
       values,
       (err, res) => {
         setLoading(false);
         if (err) {
           localStorage.removeItem("web_token");
           localStorage.removeItem("is_buyer");
           message.error(err.response.data.message);
         } else {
           message.success(res.data.message);
           setTimeout(() => {
             localStorage.setItem("web_token", res.data.token);
             localStorage.setItem("is_buyer", true);
             window.location.reload();
             <Navigate to="/" />;
           }, 500);
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
                title: "Sign Up",
              },
            ]}
          />
        </div>
      </div>
      <div className="login_section">
        <div className="wrapper">
          <div className="login_box">
            <h1>Sign Up</h1>
            <Form
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <Form.Item
                label=""
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                label=""
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email address!",
                  },
                ]}
              >
                <Input placeholder="Email Address" />
              </Form.Item>
              <Form.Item
                label=""
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <Input placeholder="Phone Number" />
              </Form.Item>
              <Form.Item
                label=""
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              <label className="f_pass">
                <Link to="/login">I have already account?</Link>
              </label>
              <div className="login_btn_align">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="l_btn"
                  loading={loading}
                >
                  Sign Up
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
