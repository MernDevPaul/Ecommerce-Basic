import React, { useState } from "react";
import { Form, Input, Button, InputNumber, Select, message } from "antd";
import axios from 'axios';
import API from "../Api/ApiService";
import { useDispatch } from "react-redux";
import {
  accountStart,
  accountSuccess,
  accountFailure,
} from "../Store/Slice/MyAccountSlice";
const AddAddressPopup = ({ handleCancel1 }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState({
    state: false,
    city: false,
    addaddress: false,
  });
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const api = new API();
  const dispatch = useDispatch();
  const onChange = async (e, type) => {
    if (type === "country") {
      setLoading((prev) => ({ ...prev, state: true }));
      let data = { country: "India" };
      const res = await axios.post(
        `https://countriesnow.space/api/v0.1/countries/states`,
        data
      );
      const res1 = res?.data?.data?.states?.map((e) => {
        return {
          value: e.name,
          label: e.name,
        };
      });
      setState(res1);
      setLoading((prev) => ({ ...prev, state: false }));
    } else if (type === "state") {
      setLoading((prev) => ({ ...prev, city: true }));
      let data = { country: "India", state: e };
      const res = await axios.post(
        `https://countriesnow.space/api/v0.1/countries/state/cities`,
        data
      );
      const res1 = res?.data?.data?.map((e) => {
        return {
          value: e,
          label: e,
        };
      });
      setCity(res1);
      setLoading((prev) => ({ ...prev, city: false }));
    }
  };

  const onFinish = async (values) => {
    setLoading((prev) => ({ ...prev, addaddress: true }));
    await api.create(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "addressadd"],
      "deliveryaddress",
      values,
      (err, res) => {
        setLoading((prev) => ({ ...prev, addaddress: false }));
        if (res) {
          message.success(res.data.message);
          form.resetFields();
          handleCancel1(false);
        } else {
          message.error(err.response.data.message);
        }

        
      }
    );
  };
  return (
    <>
      <Form
        layout="vertical"
        className="form_m_0 m_t_20"
        onFinish={onFinish}
        form={form}
      >
        <div className="col_2 g_20">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please input your email address!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Alternate Number" name="alternate_number">
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Landmark" name="landmark">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please input your country!" }]}
          >
            <Select
              showSearch
              clearIcon={true}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={(e) => onChange(e, "country")}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "India",
                  label: "India",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Please input your state!" }]}
          >
            <Select
              showSearch
              loading={loading.state}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={(e) => onChange(e, "state")}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={state}
            />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please input your city!" }]}
          >
            <Select
              showSearch
              loading={loading.city}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={(e) => onChange(e, "city")}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={city}
            />
          </Form.Item>
          <Form.Item
            label="Pincode"
            name="pincode"
            className="w_100_p"
            rules={[{ required: true, message: "Please input your pincode!" }]}
          >
            <InputNumber type="number" min={0} className="w_100_p" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading.addaddress}
            >
              Create
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default AddAddressPopup;