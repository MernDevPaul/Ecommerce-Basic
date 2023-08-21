import React, { useState } from "react";
import { Breadcrumb, Form, Input, Button, message } from "antd";
import API from '../Api/ApiService'

const Enquiry = () => {
  const [loading, setLoading] = useState(false);
  const api = new API();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    setLoading(true);
    await api.create("", ["","","",""], "enquiry", values, (err, res) => {
      if(err){
        message.error(err.response.data.message);
      } else {
        form.resetFields();
        message.success(res.data.message);
      }
      setLoading(false);
    })
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
                title: "Enquiry",
              },
            ]}
          />
        </div>
      </div>
      <div className="login_section">
        <div className="wrapper">
          <div className="login_box">
            <h1>Enquiry Form</h1>
            <Form
              form={form}
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
                    message: "Please input your name!",
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
              <Form.Item label="" name={"message"}>
                <Input.TextArea rows={3} maxLength={100} placeholder="Message" />
              </Form.Item>
              <div className="login_btn_align">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="l_btn"
                  loading={loading}
                >
                  Send Enquiry
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Enquiry