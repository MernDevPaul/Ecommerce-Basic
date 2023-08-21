import React, { useState } from "react";
import { Button, Form, Input, InputNumber, message } from "antd";
import { LockOutlined, UserOutlined, LoginOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../Redux/Slice/LoginSlice";
import logo from "../../Assets/Images/logo.png";
import API from "../../Api/ApiService";
import { Navigate } from "react-router-dom";
const Login = () => {
  const token = localStorage.getItem("admin_token");
  const login_true = localStorage.getItem("is_admin");
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = token !== "" && Boolean(login_true) === true;
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  const api = new API();
  const onFinish = async (values) => {
    setSaving(true);
    await api.create(
      dispatch,
      [loginStart, loginSuccess, loginFailure, "admin"],
      "login",
      values,
      (err, res) => {
        if (err) {
          message.error(err?.response?.data?.message);
          localStorage.removeItem("admin_token");
          localStorage.removeItem("is_admin");
          setSaving(false);
        } else {
          message.success(res?.data?.message);
          localStorage.setItem("admin_token", res?.data?.token);
          localStorage.setItem("is_admin", true);
          window.location.reload(true);
          setSaving(false);
        }
      }
    );
  };
  return (
    <section className="bg_login">
      <div className="login_section">
        <div className="login_header">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="new_register">
            <Button type="primary">Sing Up</Button>
          </div>
        </div>
        <div className="login_align">
          <div className="login_right">
            <h1>Webcome Back</h1>
            <Form
              form={form}
              name="admin_login"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Mobile Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter valid mobile number",
                  },
                ]}
              >
                <InputNumber
                  prefix={
                    <UserOutlined className="site-form-item-icon anticongray" />
                  }
                  placeholder="Mobile Number"
                  type="number"
                  className="width_100"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter valid password!",
                  },
                ]}
              >
                <Input.Password
                  prefix={
                    <LockOutlined className="site-form-item-icon anticongray" />
                  }
                  placeholder="Password"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                className="m_t_10"
              >
                <LoginOutlined /> Sign In
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
