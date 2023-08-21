import React, { useEffect, useState } from "react";
import BreadcrumbDynamic from "../../Api/BreadcrumbDynamic";
import { Button, Input, Popconfirm, Form, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import API from "../../Api/ApiService";
import FormService from "../../Api/FormsService";
import { tagsStart, tagsSuccess, tagsFailure } from "../../Redux/Slice/TagsSlice";
const Tags = ({ title }) => {
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
  const lists = useSelector((state) => state?.tags?.tagslist?.data);
  const list_single = useSelector((state) => state?.tags?.tagssingle?.data);
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
      [tagsStart, tagsSuccess, tagsFailure, "tagslist"],
      "mastersettings",
      {type:"tags"},
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
      values["type"] = "tags";
      await api.create(
        dispatch,
        [tagsStart, tagsSuccess, tagsFailure, "tagsadd"],
        "mastersettings",
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
        [tagsStart, tagsSuccess, tagsFailure, "tagssingle"],
        "mastersettings",
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
        [tagsStart, tagsSuccess, tagsFailure, "tagsedit"],
        "mastersettings",
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
        [tagsStart, tagsSuccess, tagsFailure, "tagsdelete"],
        "mastersettings",
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
        [tagsStart, tagsSuccess, tagsFailure, "tagsdeletemany"],
        "mastersettings",
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
        [tagsStart, tagsSuccess, tagsFailure, "tagssingle"],
        "mastersettings",
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
    name: e.name ?? "",
    status: [e.status ?? ""],
    action: e._id ?? "",
  }));
  const columns = [
    {
      title: "Tags Name",
      dataIndex: "name",
      ...from_service.tableService("name"),
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
                {from_service.formview("Tags Name", list_single?.name)}
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
          450,
          <>
            <Form
              layout="vertical"
              form={formCreate}
              onFinish={(e) => handleSubmit(e, "create")}
            >
              {[
                from_service.input(
                  "Tags Name",
                  "name",
                  true,
                  "Tags name is required"
                ),
                from_service.switch("Status", "status", true),
                from_service.button(
                  "primary",
                  "submit",
                  "Create",
                  loading.create
                ),
              ]}
            </Form>
          </>
        )}
        {from_service.model(
          "Edit",
          openModal.type === "edit",
          null,
          () => closePopup(),
          450,
          <>
            <Form
              layout="vertical"
              form={formEdit}
              onFinish={(e) => handleSubmit(e, "update")}
            >
              {[
                from_service.input(
                  "Tags Name",
                  "name",
                  true,
                  "Tags name is required"
                ),
                from_service.switch("Status", "status", true),
                from_service.button(
                  "primary",
                  "submit",
                  "Create",
                  loading.create
                ),
              ]}
            </Form>
          </>
        )}
      </div>
    </>
  );
};

export default Tags;
