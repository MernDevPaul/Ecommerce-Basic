import React, { useEffect, useState } from "react";
import { Breadcrumb, Form, Input, Button,message } from "antd";
import { Link,Navigate } from "react-router-dom";
import API from '../Api/ApiService'
import { loginStart, loginSuccess, loginFailure } from '../Store/Slice/LoginSlice';
import { useDispatch } from 'react-redux';
const Login = () => {
  const [loading, setLoading] = useState(false);
  const api = new API();
  const dispatch = useDispatch();
  const isAuthenticated = api.webtoken !== "" && Boolean(api.isbuyer) === true;
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  const onFinish = async (values) => {
    setLoading(true);
     await api.create(dispatch, [loginStart, loginSuccess, loginFailure, "login"], "login", values, (err, res) => {
      setLoading(false);
      if (err) {
        localStorage.removeItem("web_token");
        localStorage.removeItem("is_buyer");
        message.error(err.response.data.message);
      } else {
        localStorage.setItem("web_token", res.data.token);
        localStorage.setItem("is_buyer", true);
        message.success(res.data.message);
        window.location.reload();
        <Navigate to="/" />;
      }
    });
  }
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
                title: "Login",
              },
            ]}
          />
        </div>
      </div>
      <div className="login_section">
        <div className="wrapper">
          <div className="login_box">
            <h1>Login</h1>
            <Form
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
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
                <Link to="/forgot-password">Forgot Password?</Link>
              </label>
              <div className="login_btn_align">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="l_btn"
                  loading={loading}
                >
                  Login
                </Button>
                <Link to={"/register"}>
                  <Button type="primary" htmlType="button" className="s_btn">
                    SignUp
                  </Button>
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login