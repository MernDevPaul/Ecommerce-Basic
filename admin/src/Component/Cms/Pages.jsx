import React, { useEffect, useState } from "react";
import BreadcrumbDynamic from "../../Api/BreadcrumbDynamic";
import default_img from "../../Assets/Images/banner_default.jpg";
import ImgCrop from "antd-img-crop";
import {
  Button,
  Input,
  Popconfirm,
  Form,
  Spin,
  Upload,
  Image,
  Space,
  Modal,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import API from "../../Api/ApiService";
import FormService from "../../Api/FormsService";
import {
  pagesStart,
  pagesSuccess,
  pagesFailure,
} from "../../Redux/Slice/PagesSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const Pages = ({ title }) => {
  const [loading, setLoading] = useState({
    delete: false,
    deleteMany: false,
    create: false,
    edit: false,
    update: false,
    view: false,
    table: false,
  });
  const [value, setValue] = useState("");
  const api = new API();
  const from_service = new FormService();
  const [formCreate] = Form.useForm();
  const [formEdit] = Form.useForm();
  const dispatch = useDispatch();
  const lists = useSelector((state) => state?.pages?.pageslist?.data);
  const list_single = useSelector((state) => state?.pages?.pagessingle?.data);
  const [openModal, setOpenModal] = useState({
    type: "", // 'create' or 'edit' or 'delete' or 'deletemany'
    visible: false,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const desktop = 1920 / 560;
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
  const openPopup = (type) => {
    setValue("");
    setFileList([]);
    setOpenModal({ type: type, visible: true });
  };
  const closePopup = () => {
    setOpenModal({ type: "", visible: false });
  };
  const initFunction = async () => {
    setLoading((prev) => ({ ...prev, table: true }));
    await api.getAll(
      dispatch,
      [pagesStart, pagesSuccess, pagesFailure, "pageslist"],
      "pages",
      {},
      (err, res) => {
        setLoading((prev) => ({ ...prev, table: false }));
      }
    );
    
  };
  useEffect(() => {
    initFunction();
  }, []);
  const handleSubmit = async (values, actionType) => {
    if (actionType === "create") {
      setLoading((prev) => ({ ...prev, create: true }));
      const form_data = new FormData();
      form_data.append("image", fileList[0]?.originFileObj);
      form_data.append("description", value);
      form_data.append("title", values["title"]);
      form_data.append("category", values["category"]);
      form_data.append("tags", values["tags"]);
      await api.create(
        dispatch,
        [pagesStart, pagesSuccess, pagesFailure, "pagesadd"],
        "pages",
        form_data,
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, create: false }));
          } else {
            setLoading((prev) => ({ ...prev, create: false }));
            from_service.message("success", res?.data?.message);
            initFunction();
            formCreate.resetFields();
            closePopup();
          }
        }
      );
    } else if (actionType === "edit") {
      
      setLoading((prev) => ({ ...prev, edit: true }));
      setFileList([]);
      await api.getSingle(
        dispatch,
        [pagesStart, pagesSuccess, pagesFailure, "pagessingle"],
        "pages",
        values,
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, edit: false }));
          } else {
            setLoading((prev) => ({ ...prev, edit: false }));
            formEdit.setFieldsValue({
              ...res?.data?.data,
           });
            setValue(res?.data?.data?.description);
            if (res?.data?.data?.image) {
              setFileList([
                {
                  uid: res?.data?.data?._id,
                  name: res?.data?.data?.title,
                  status: "done",
                  url: `http://localhost:9000/${res?.data?.data?.image}`,
                },
              ]);
            }
            
            setOpenModal({ type: "edit", visible: true });
          }
        }
      );
    } else if (actionType === "update") {
      setLoading((prev) => ({ ...prev, update: true }));
      const form_data = new FormData();
      form_data.append("image", fileList[0]?.originFileObj);
      form_data.append("description", value);
      form_data.append("title", values["title"]);
      form_data.append("category", values["category"]);
      form_data.append("tags", values["tags"]);
      await api.update(
        dispatch,
        [pagesStart, pagesSuccess, pagesFailure, "pagesedit"],
        "pages",
        list_single?._id,
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
    } else if (actionType === "delete") {
      setLoading((prev) => ({ ...prev, delete: true }));
      await api.remove(
        dispatch,
        [pagesStart, pagesSuccess, pagesFailure, "pagesdelete"],
        "pages",
        values,
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, delete: false }));
          } else {
            setLoading((prev) => ({ ...prev, delete: false }));
            from_service.message("success", res?.data?.message);
            initFunction();
          }
        }
      );
    } else if (actionType === "deletemany") {
      setLoading((prev) => ({ ...prev, deleteMany: true }));
      await api.removeMany(
        dispatch,
        [pagesStart, pagesSuccess, pagesFailure, "pagesdeletemany"],
        "pages",
        { ids: values },
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, deleteMany: false }));
          } else {
            setLoading((prev) => ({ ...prev, deleteMany: false }));
            from_service.message("success", res?.data?.message);
            setSelectedRowKeys([]);
            initFunction();
          }
        }
      );
    } else if (actionType === "view") {
      setLoading((prev) => ({ ...prev, view: true }));
      await api.getSingle(
        dispatch,
        [pagesStart, pagesSuccess, pagesFailure, "pagessingle"],
        "pages",
        values,
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, view: false }));
          } else {
            setLoading((prev) => ({ ...prev, view: false }));
            setOpenModal({ type: "view", visible: true });
          }
        }
      );
    }
  };
  //table search
  const handleSearch = (searchText) => {
    const keys = ["title"];
    const filtered = data_table.filter((item) =>
      keys.some((key) =>
        item[key].toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const data_table = lists?.map((e) => ({
    key: e._id ?? "",
    title: e?.title ?? "",
    image:
      (
        <Image
          src={e?.image ? `http://localhost:9000/${e?.image}` : default_img}
          className="t_image_35"
        />
      ) ?? "",
    status: [e.status ?? ""],
    action: e._id ?? "",
  }));
  const columns = [
    {
      title: "Blog Name",
      dataIndex: "title",
      ...from_service.tableService("title"),
    },
    {
      title: "Image",
      dataIndex: "image",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: from_service.statusTable("status"),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: 105,
      render: (action) => (
        <div className="action_btn_table">
          <p className=" edit" onClick={() => handleSubmit(action, "view")}>
            <EyeOutlined />
          </p>
          <p className=" edit" onClick={() => handleSubmit(action, "edit")}>
            <EditOutlined />
          </p>
          <Popconfirm
            title=" Are you Sure to delete?"
            onConfirm={() => handleSubmit(action, "delete")}
            okButtonProps={{
              loading: loading.delete,
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <BreadcrumbDynamic title={title} />
      <div className="bg_box p_20">
        <div className="action_head">
          <div className="action_head_left">
            <Input
              size="medium"
              placeholder="Search"
              className="width_230"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="action_head_right">
            {selectedRowKeys.length > 0 && (
              <Button
                type="primary"
                danger
                className="action_btn"
                onClick={() => handleSubmit(selectedRowKeys, "deletemany")}
                loading={loading.deleteMany}
              >
                <DeleteOutlined /> Delete
              </Button>
            )}
            <Button
              type="primary"
              className="action_btn"
              onClick={() => openPopup("create")}
            >
              <PlusCircleOutlined /> Add
            </Button>
          </div>
        </div>
        {from_service.tableDynamic(
          rowSelection,
          columns,
          filteredData.length > 0 ? filteredData : data_table,
          loading.table
        )}
        {from_service.model(
          "View",
          openModal.type === "view",
          null,
          () => closePopup(),
          450,
          <>
            {loading.view ? (
              <Spin
                style={{
                  margin: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            ) : (
              <div className="view_model_form">
                {from_service.formview("Blog Name", list_single?.title)}
                {from_service.formview(
                  "Image",
                  <Image
                    src={
                      list_single?.image
                        ? `http://localhost:9000/${list_single?.image}`
                        : default_img
                    }
                    className="t_image_35"
                  />
                )}
                {from_service.formview(
                  "Status",
                  list_single?.status === true ? "Active" : "Inactive"
                )}
              </div>
            )}
          </>
        )}
        {from_service.model(
          "Create",
          openModal.type === "create",
          null,
          () => closePopup(),
          1200,
          <>
            <Form
              layout="vertical"
              form={formCreate}
              onFinish={(e) => handleSubmit(e, "create")}
            >
              <div className="col_1 g_20">
                <div className="col_1 g_20 col_2_xl col_1_sm">
                  <div className="col_1">
                    {from_service.input(
                      "Title",
                      "title",
                      true,
                      "Blog name is required"
                    )}
                  </div>
                </div>
                <div className="col_1 g_10">
                  <label>Description</label>
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    className="height_300_px"
                  />
                </div>
                <div className="col_1 g_5">
                  <label className="m_b_10">Image</label>
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
                <div className="col_1">
                  {from_service.button("primary", "submit", "Create")}
                </div>
              </div>
            </Form>
          </>
        )}
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
              <div className="col_1 g_20">
                <div className="col_1 g_20 col_2_xl col_1_sm">
                  <div className="col_1">
                    {from_service.input(
                      "Title",
                      "title",
                      true,
                      "Blog name is required"
                    )}
                  </div>
                </div>
                <div className="col_1 g_10">
                  <label>Description</label>
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    className="height_300_px"
                  />
                </div>
                <div className="col_1 g_5">
                  <label className="m_b_10">Image</label>
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
                <div className="col_1">
                  {from_service.button(
                    "primary",
                    "submit",
                    "Update",
                    loading.update
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </div>
    </>
  );
};

export default Pages;
