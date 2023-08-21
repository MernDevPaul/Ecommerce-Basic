import React, { useState,useEffect } from "react";
import { Form, Input, Button, Radio, Upload, Modal, message } from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import API from "../Api/ApiService";
import { useDispatch,useSelector } from "react-redux";
import {
  accountStart,
  accountSuccess,
  accountFailure,
} from "../Store/Slice/MyAccountSlice";
const MyProfile = () => {
  const api = new API();
  const dispatch = useDispatch();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const [updateForm] = Form.useForm();
  const desktop = 150 / 150;
  const my_profile = useSelector((state) => state?.account?.getprofile?.data);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  
  //init Function
  const initFunction = async () => {
    await api.getSingle(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "getprofile"],
      "profile",
      "",
      (err, res) => {
        if (res) {
          updateForm.setFieldsValue(res.data.data);
          res?.data?.data?.image &&
            setFileList([
              {
                uid: "-1",
                name: res?.data?.data?.image,
                status: "done",
                url: api.apiUrl+res?.data?.data?.image,
              },
            ]);
        }
       }
    );
  };

  //init
  useEffect(() => {
    initFunction();
  },[])
  
  const onFinish = async (values) => {
    const form_data = new FormData();
    form_data.append("name", values?.name);
    form_data.append("gender", values?.gender);
    form_data.append("image", fileList[0]?.originFileObj);
    await api.update(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "updateprofile"],
      "profile",
      my_profile?._id,
      form_data,
      (err, res) => {
        if (res) {
          message.success(res.data.message);
          initFunction();
          updateForm.setFieldsValue(res.data.data);
          res?.data?.data?.image &&
            setFileList([
              {
                uid: "-1",
                name: res?.data?.data?.image,
                status: "done",
                url: api.apiUrl + res?.data?.data?.image,
              },
            ]);
        } else {
          message.error(err.response.data.message);
        }
      }
    );
  }
  return (
    <>
      <Form layout="vertical" onFinish={onFinish} form={updateForm}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Gender" name="gender">
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="others">Others</Radio>
          </Radio.Group>
        </Form.Item>
        <div className="upload_pro_img">
          <label className="col_1 m_b_10">Image</label>
          <ImgCrop
            rotationSlider
            aspect={desktop}
            modalProps={{ centered: true }}
          >
            <Upload
              action="http://localhost:9000"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </ImgCrop>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </div>
        <Form.Item className="m_t_20">
          <Button type="primary" htmlType="submit">
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default MyProfile