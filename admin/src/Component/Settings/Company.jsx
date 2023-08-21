import React, { useState, useEffect } from "react";
import BreadcrumbDynamic from "../../Api/BreadcrumbDynamic";
import { useSelector, useDispatch } from "react-redux";
import FormService from "../../Api/FormsService";
import API from "../../Api/ApiService";
import {
  companyStart,
  companySuccess,
  companyFailure,
} from "../../Redux/Slice/CompanySlice";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, Form, Image } from "antd";
const Company = ({ title }) => {
  const [loading, setLoading] = useState({
    update: false,
    view: false,
  });
  const dispatch = useDispatch();
  const api = new API();
  const from_service = new FormService();
  const [formEdit] = Form.useForm();
  const lists = useSelector((state) => state?.company?.companylist?.data);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
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
  const initFunction = async () => {
    await api.getAll(
      dispatch,
      [companyStart, companySuccess, companyFailure, "companylist"],
      "company",
      {},
      (err, res) => {
        if (res) {
          formEdit.setFieldsValue(res?.data?.data);
          setFileList([
            {
              uid: res?.data?.data?._id,
              name: res?.data?.data?.company_name,
              status: "done",
              url: `http://localhost:9000/${res?.data?.data?.logo}`,
            },
          ]);
        }
      }
    );
  };
  useEffect(() => {
    initFunction();
  }, []);
  const [openModal, setOpenModal] = useState({
    type: "", // 'create' or 'edit' or 'delete' or 'deletemany'
    visible: false,
  });
  const openPopup = async (type) => {
    setOpenModal({ type: type, visible: true });
  };
  const closePopup = () => {
    setOpenModal({ type: "", visible: false });
  };

  const handleSubmit = async (values, actionType) => {
    const data = Object.keys(values);
    const form_data = new FormData();
    form_data.append("logo", fileList[0].originFileObj);
    data.forEach((key) => {
      form_data.append(key, values[key]);
    });
    if (actionType === "update") {
      setLoading((prev) => ({ ...prev, update: true }));
      await api.update(
        dispatch,
        [companyStart, companySuccess, companyFailure, "companyedit"],
        "company",
        lists?._id,
        form_data,
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, update: false }));
          } else {
            setLoading((prev) => ({ ...prev, update: false }));
            from_service.message("success", res?.data?.message);
            initFunction();
            closePopup();
          }
        }
      );
    }
  };

  return (
    <>
      <BreadcrumbDynamic title={title} />
      <div className="company_details_section">
        <div className="company_details_align">
          <div className="company_details_left">
            <div className="bg_box p_25 g_15 col_1">
              <div className="bg_box_head">
                <h3>General Settings</h3>
              </div>
              <div className="col_1 g_20">
                <div className="col_3 g_20 col_2_xl col_1_sm">
                  <div className="col_1">
                    {from_service.formviewnormal(
                      "Company Name",
                      lists?.company_name
                    )}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal("Phone Number", lists?.phone)}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal("Email Address", lists?.email)}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal("Country", lists?.country)}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal("State", lists?.state)}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal("City", lists?.city)}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal("Pincode", lists?.pincode)}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal("Landline", lists?.landline)}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg_box p_25 col_1 g_15">
              <div className="bg_box_head">
                <h3>Company Details</h3>
              </div>
              <div className="col_1 g_20">
                <div className="col_3 g_20 col_2_xl col_1_sm">
                  <div className="col_1">
                    {from_service.formviewnormal(
                      "Pan Number",
                      lists?.company_name
                    )}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal(
                      "GST Number",
                      lists?.company_name
                    )}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal(
                      "Website Url",
                      lists?.company_name
                    )}
                  </div>
                </div>
                <div className="col_1 g_20">
                  <div className="col_1">
                    {from_service.formviewnormal(
                      "Company Address",
                      lists?.address
                    )}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal("Map Location", lists?.map)}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg_box p_25 col_1 g_15">
              <div className="bg_box_head">
                <h3>Payment Settings</h3>
              </div>
              <div className="col_1 g_20">
                <div className="col_2 g_20 col_1_sm">
                  <div className="col_1">
                    {from_service.formviewnormal(
                      "Payment Key",
                      lists?.payment_key
                    )}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal(
                      "Payment Salt",
                      lists?.payment_salt
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg_box p_25 col_1 g_15">
              <div className="bg_box_head">
                <h3>Mail Settings</h3>
              </div>
              <div className="col_1 g_20">
                <div className="col_2 g_20 col_1_sm">
                  <div className="col_1">
                    {from_service.formviewnormal(
                      "SMTP Username",
                      lists?.smtp_username
                    )}
                  </div>
                  <div className="col_1">
                    {from_service.formviewnormal(
                      "SMTP Password",
                      lists?.smtp_password
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="company_details_right">
            <div className="bg_box p_25">
              <div className="a_r">
                {from_service.buttonClick(
                  "primary",
                  "submit",
                  "Edit",
                  loading.edit,
                  () => openPopup("edit")
                )}
              </div>
            </div>
            <div className="bg_box p_25 col_1 g_15">
              <div className="bg_box_head">
                <h3>Logo</h3>
              </div>
              <div className="col_1">
                <Image
                  width={130}
                  src={`http://localhost:9000/${lists?.logo}`}
                />
              </div>
            </div>
            <div className="bg_box p_25 col_1 g_15">
              <div className="bg_box_head">
                <h3>Notification</h3>
              </div>
              <div className="col_1 g_20">
                <div className="col_1">
                  {from_service.formviewnormal(
                    "Email Notification",
                    lists?.notify_receive === true ? "On" : "Off"
                  )}
                </div>
                <div className="col_1">
                  {from_service.formviewnormal(
                    "New Order",
                    lists?.new_order_email === true ? "On" : "Off"
                  )}
                </div>
                <div className="col_1">
                  {from_service.formviewnormal(
                    "Enquiry",
                    lists?.new_enquiry_email === true ? "On" : "Off"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {from_service.model(
        "Edit",
        openModal.type === "edit",
        null,
        () => closePopup(),
        1200,
        <>
          <Form
            layout="vertical"
            form={formEdit}
            onFinish={(e) => handleSubmit(e, "update")}
          >
            <>
              <div className="col_1 g_25">
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>General Settings</h3>
                  </div>
                  <div className="col_3 g_20 col_2_xl col_1_sm">
                    <div className="col_1">
                      {from_service.input(
                        "Company Name",
                        "company_name",
                        false,
                        ""
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.number("Phone Number", "phone", false, "")}
                    </div>
                    <div className="col_1">
                      {from_service.input("Email Address", "email", false, "")}
                    </div>

                    <div className="col_1">
                      {from_service.input("Country", "country", false, "")}
                    </div>
                    <div className="col_1">
                      {from_service.input("State", "state", false, "")}
                    </div>
                    <div className="col_1">
                      {from_service.input("City", "city", false, "")}
                    </div>

                    <div className="col_1">
                      {from_service.number("Pincode", "pincode", false, "")}
                    </div>
                    <div className="col_1">
                      {from_service.number("Landline", "landline", false, "")}
                    </div>
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Company Details</h3>
                  </div>
                  <div className="col_3 g_20 col_2_xl col_1_sm">
                    <div className="col_1">
                      {from_service.input("Pan Number", "pan_no", false, "")}
                    </div>
                    <div className="col_1">
                      {from_service.input("GST Number", "gst_in", false, "")}
                    </div>
                    <div className="col_1">
                      {from_service.input("Website Url", "website", false, "")}
                    </div>
                  </div>
                  <div className="col_2 g_20 col_1_sm">
                    <div className="col_1">
                      {from_service.textarea(
                        "Company Address",
                        "address",
                        false,
                        ""
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.textarea("Map Location", "map", false, "")}
                    </div>
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Company Logo</h3>
                  </div>
                  <div className="col_1">
                    <>
                      <Upload
                        action="http://localhost:9000"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                      >
                        {fileList.length >= 1 ? null : uploadButton}
                      </Upload>
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
                    </>
                  </div>
                </div>

                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Payment Settings</h3>
                  </div>
                  <div className="col_2 g_20 col_1_sm">
                    <div className="col_1">
                      {from_service.input(
                        "Payment Key",
                        "payment_key",
                        false,
                        ""
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.input(
                        "Payment Salt",
                        "payment_salt",
                        false,
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Mail Settings</h3>
                  </div>
                  <div className="col_2 g_20 col_1_sm">
                    <div className="col_1">
                      {from_service.input(
                        "SMTP Username",
                        "smtp_username",
                        false,
                        ""
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.input(
                        "SMTP Password",
                        "smtp_password",
                        false,
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Notification Settings</h3>
                  </div>
                  <div className="col_3 g_20 col_2_xl col_1_sm">
                    <div className="col_1">
                      {from_service.switch(
                        "All Notification",
                        "notify_receive",
                        lists?.notify_receive
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.switch(
                        "New Order",
                        "new_order_email",
                        lists?.new_order_email
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.switch(
                        "Enquiry",
                        "new_enquiry_email",
                        lists?.new_enquiry_email
                      )}
                    </div>
                  </div>
                </div>
                <div className="col_1">
                  {from_service.button(
                    "primary",
                    "submit",
                    "Update",
                    loading.update
                  )}
                </div>
              </div>
            </>
          </Form>
        </>
      )}
    </>
  );
};

export default Company;
