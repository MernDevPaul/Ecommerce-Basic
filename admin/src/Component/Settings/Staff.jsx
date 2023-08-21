import React, { useEffect, useState } from "react";
import BreadcrumbDynamic from "../../Api/BreadcrumbDynamic";
import { Button, Input, Popconfirm, Form, Spin, Image } from "antd";
import { useSelector, useDispatch } from "react-redux";
import dummy_profile from "../../Assets/Images/dummy_profile.png";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import API from "../../Api/ApiService";
import FormService from "../../Api/FormsService";
import {
  staffStart,
  staffSuccess,
  staffFailure,
} from "../../Redux/Slice/StaffSlice";
const Staff = ({ title }) => {
  const [loading, setLoading] = useState({
    delete: false,
    deleteMany: false,
    create: false,
    edit: false,
    update: false,
    view: false,
    table: false,
  });
  const api = new API();
  const from_service = new FormService();
  const [formCreate] = Form.useForm();
  const [formEdit] = Form.useForm();
  const dispatch = useDispatch();
  const lists = useSelector((state) => state?.staff?.stafflist?.data);
  const list_single = useSelector((state) => state?.staff?.staffsingle?.data);
  const [openModal, setOpenModal] = useState({
    type: "", // 'create' or 'edit' or 'delete' or 'deletemany'
    visible: false,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const openPopup = (type) => {
    setOpenModal({ type: type, visible: true });
  };
  const closePopup = () => {
    setOpenModal({ type: "", visible: false });
  };
  const initFunction = async () => {
    setLoading((prev) => ({ ...prev, table: true }));
    await api.getAll(
      dispatch,
      [staffStart, staffSuccess, staffFailure, "stafflist"],
      "staff",
      {},
      (err, res) => {
        console.log("res", res);
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
      await api.create(
        dispatch,
        [staffStart, staffSuccess, staffFailure, "staffadd"],
        "staff",
        values,
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
      await api.getSingle(
        dispatch,
        [staffStart, staffSuccess, staffFailure, "staffsingle"],
        "staff",
        values,
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, edit: false }));
          } else {
            setLoading((prev) => ({ ...prev, edit: false }));
            formEdit.setFieldsValue(res?.data?.data);
            setOpenModal({ type: "edit", visible: true });
          }
        }
      );
    } else if (actionType === "update") {
      setLoading((prev) => ({ ...prev, update: true }));
      await api.update(
        dispatch,
        [staffStart, staffSuccess, staffFailure, "staffedit"],
        "staff",
        list_single?._id,
        values,
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
        [staffStart, staffSuccess, staffFailure, "staffdelete"],
        "staff",
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
        [staffStart, staffSuccess, staffFailure, "staffdeletemany"],
        "staff",
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
        [staffStart, staffSuccess, staffFailure, "staffsingle"],
        "staff",
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
    const keys = ["name"];
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
    name:
      (
        <div className="table_img">
          <Image
            src={e.image ? `http://localhost:9000/${e.image}` : dummy_profile}
          />
          <p>{e.name}</p>
        </div>
      ) ?? "",
    phone: e.phone ?? "",
    email: e.email ?? "",
    status: [e.status ?? ""],
    action: e._id ?? "",
  }));
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      ...from_service.tableService("name"),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      ...from_service.tableService("email"),
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      ...from_service.tableService("phone"),
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

  const gender_option = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Others", value: "others" },
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
                {from_service.formview("Name", list_single?.name)}
                {from_service.formview("Email Address", list_single?.email)}
                {from_service.formview("Phone Number", list_single?.phone)}
                {from_service.formview("Password", list_single?.password)}
                {from_service.formview(
                  "Is Blocked",
                  list_single?.is_blocked === true ? "Blocked" : "Not Blocked"
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
          800,
          <>
            <Form
              layout="vertical"
              form={formCreate}
              onFinish={(e) => handleSubmit(e, "create")}
            >
              <div className="col_1 g_10">
                <div className="col_2 g_5_20">
                  {from_service.input("Name", "name", true, "Name is required")}
                  {from_service.input(
                    "Phone Number",
                    "phone",
                    true,
                    "Phone Number is required"
                  )}
                  {from_service.input(
                    "Email Address",
                    "email",
                    true,
                    "Email Address is required"
                  )}
                  {from_service.input(
                    "Password",
                    "password",
                    true,
                    "Password is required"
                  )}
                </div>
                <div className="col_2 g_20 m_t_10">
                  <div className="col_1">
                    {from_service.switch("Status", "status", true)}
                  </div>
                  <div className="col_1">
                    {from_service.switch("Is Blocked", "is_blocked", false)}
                  </div>
                  <div className="col_1">
                    {from_service.button("primary", "submit", "Create")}
                  </div>
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
          800,
          <>
            <Form
              layout="vertical"
              form={formEdit}
              onFinish={(e) => handleSubmit(e, "update")}
            >
              <div className="col_1 g_10">
                <div className="col_2 g_5_20">
                  {from_service.input("Name", "name", true, "Name is required")}
                  {from_service.input(
                    "Phone Number",
                    "phone",
                    true,
                    "Phone Number is required"
                  )}
                  {from_service.input(
                    "Email Address",
                    "email",
                    true,
                    "Email Address is required"
                  )}
                  {from_service.input(
                    "Password",
                    "password",
                    true,
                    "Password is required"
                  )}
                </div>

                <div className="col_2 g_20 m_t_10">
                  <div className="col_1">
                    {from_service.switch("Status", "status", true)}
                  </div>
                  <div className="col_1">
                    {from_service.switch("Is Blocked", "is_blocked", false)}
                  </div>
                  <div className="col_1">
                    {from_service.button("primary", "submit", "Create")}
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </div>
    </>
  );
};

export default Staff;
