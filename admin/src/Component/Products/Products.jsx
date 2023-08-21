import React, { useEffect, useState } from "react";
import BreadcrumbDynamic from "../../Api/BreadcrumbDynamic";
import pro from "../../Assets/Images/pro.png";
import {
  Button,
  Input,
  Popconfirm,
  Form,
  Spin,
  Image,
  Upload,
  Modal,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useSelector, useDispatch } from "react-redux";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import API from "../../Api/ApiService";
import FormService from "../../Api/FormsService";
import {
  productsStart,
  productsSuccess,
  productsFailure,
} from "../../Redux/Slice/ProductsSlice";
import {
  brandsStart,
  brandsSuccess,
  brandsFailure,
} from "../../Redux/Slice/BrandsSlice";
import {
  categoryStart,
  categorySuccess,
  categoryFailure,
} from "../../Redux/Slice/CategorySlice";
import {
  tagsStart,
  tagsSuccess,
  tagsFailure,
} from "../../Redux/Slice/TagsSlice";
import { taxStart, taxSuccess, taxFailure } from "../../Redux/Slice/TaxSlice";
const Products = ({ title }) => {
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const desktop = 500 / 500;
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
  const lists = useSelector((state) => state?.products?.productslist?.data);
  const clists = useSelector((state) => state?.category?.categorylist?.data);
  const blists = useSelector((state) => state?.brands?.brandslist?.data);
  const tlists = useSelector((state) => state?.tags?.tagslist?.data);
  const taxlists = useSelector((state) => state?.tax?.taxlist?.data);
  const list_single = useSelector(
    (state) => state?.products?.productssingle?.data
  );
  const [openModal, setOpenModal] = useState({
    type: "", // 'create' or 'edit' or 'delete' or 'deletemany'
    visible: false,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const openPopup = (type) => {
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
      [productsStart, productsSuccess, productsFailure, "productslist"],
      "product",
      {},
      (err, res) => {
        setLoading((prev) => ({ ...prev, table: false }));
      }
    );
    await api.getAll(
      dispatch,
      [brandsStart, brandsSuccess, brandsFailure, "brandslist"],
      "mastersettings",
      { type: "brands", status: true },
      (err, res) => {
        setLoading((prev) => ({ ...prev, table: false }));
      }
    );
    await api.getAll(
      dispatch,
      [categoryStart, categorySuccess, categoryFailure, "categorylist"],
      "mastersettings",
      { type: "category", status: true },
      (err, res) => {
        setLoading((prev) => ({ ...prev, table: false }));
      }
    );
    await api.getAll(
      dispatch,
      [tagsStart, tagsSuccess, tagsFailure, "tagslist"],
      "mastersettings",
      { type: "tags", status: true },
      (err, res) => {
        setLoading((prev) => ({ ...prev, table: false }));
      }
    );
    await api.getAll(
      dispatch,
      [taxStart, taxSuccess, taxFailure, "taxlist"],
      "tax",
      { status: true },
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
      if (fileList && Array.isArray(fileList)) {
        fileList.forEach((file) => {
          form_data.append("image", file.originFileObj);
        });
      }
      Object.keys(values).forEach((key) => {
        const value = values[key];
        if (
          value !== undefined &&
          value !== "" &&
          value !== null &&
          value !== "undefined"
        ) {
          if (key === "specification") {
            values["specification"].forEach((item, index) => {
              form_data.append(`specification[${index}][name]`, item.name);
              form_data.append(
                `specification[${index}][description]`,
                item.description
              );
            });
          } else if (key === "category") {
            values["category"].forEach((item, index) => {
              form_data.append(`category[${index}]`, item);
            });
          } else if (key === "tags") {
            values["tags"].forEach((item, index) => {
              form_data.append(`tags[${index}]`, item);
            });
          } else {
            form_data.append(key, value);
          }
        }
      });

      await api.create(
        dispatch,
        [productsStart, productsSuccess, productsFailure, "productsadd"],
        "product",
        form_data,
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, create: false }));
          } else {
            setLoading((prev) => ({ ...prev, create: false }));
            from_service.message("success", res?.data?.message);
            setFileList([]);
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
        [productsStart, productsSuccess, productsFailure, "productssingle"],
        "product",
        values,
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, edit: false }));
          } else {
            setLoading((prev) => ({ ...prev, edit: false }));
            formEdit.setFieldsValue({ ...res?.data?.data, tax: res?.data?.data?.tax?._id, brand: res?.data?.data?.brand?._id, category: res?.data?.data?.category?.map(item => item._id), tags: res?.data?.data?.tags?.map(item => item._id) });
            setFileList(
              res?.data?.data?.image?.map((item) => ({
                uid: item._id,
                name: item.name,
                status: "done",
                url: `http://localhost:9000/${item?.image_path}`,
              }))
            )
            setOpenModal({ type: "edit", visible: true });
          }
        }
      );
    } else if (actionType === "update") {
      setLoading((prev) => ({ ...prev, update: true }));
      const form_data = new FormData();
      if (fileList && Array.isArray(fileList)) {
        fileList.forEach((file) => {
          form_data.append("image", file.originFileObj);
        });
      }
      Object.keys(values).forEach((key) => {
        const value = values[key];
        if (
          value !== undefined &&
          value !== "" &&
          value !== null &&
          value !== "undefined"
        ) {
          if (key === "specification") {
            values["specification"].forEach((item, index) => {
              form_data.append(`specification[${index}][name]`, item.name);
              form_data.append(
                `specification[${index}][description]`,
                item.description
              );
            });
          } else if (key === "category") {
            values["category"].forEach((item, index) => {
              form_data.append(`category[${index}]`, item);
            });
          } else if (key === "tags") {
            values["tags"].forEach((item, index) => {
              form_data.append(`tags[${index}]`, item);
            });
          } else {
            form_data.append(key, value);
          }
        }
      });
      await api.update(
        dispatch,
        [productsStart, productsSuccess, productsFailure, "productsedit"],
        "product",
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
        [productsStart, productsSuccess, productsFailure, "productsdelete"],
        "product",
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
        [productsStart, productsSuccess, productsFailure, "productsdeletemany"],
        "product",
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
        [productsStart, productsSuccess, productsFailure, "productssingle"],
        "product",
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
    const keys = ["product_name"];
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
    product_name: e.product_name ?? "",
    image:
      (
        <Image
          src={
            e.image[0] ? `http://localhost:9000/${e.image[0]?.image_path}` : pro
          }
          className="t_image_35"
        />
      ) ?? "",
    sku: e.sku ?? "",
    brand: e?.brand?.name ?? "",
    category: e?.category[0]?.name ?? "",
    status: [e.status ?? ""],
    action: e._id ?? "",
  }));
  const columns = [
    {
      title: "Products Name",
      dataIndex: "product_name",
      ...from_service.tableService("product_name"),
    },
    {
      title: "Image",
      dataIndex: "image",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      ...from_service.tableService("sku"),
    },
    {
      title: "Brand",
      dataIndex: "brand",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 105,
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

  const b_option = blists?.map((e) => ({
    value: e._id,
    label: e.name,
  }));
  const t_option = tlists?.map((e) => ({
    value: e._id,
    label: e.name,
  }));
  const c_option = clists?.map((e) => ({
    value: e._id,
    label: e.name,
  }));
  const tax_option = taxlists?.map((e) => ({
    value: e._id,
    label: e.name,
  }));

  const onRemove = async (e) => {
    const form_data = {
      image_type: "remove",
      image_id: e?.uid,
    };
    await api.update(
      dispatch,
      ["", "", "", ""],
      "product",
      list_single?._id,
      form_data,
      (err, res) => {
        if (res) {
          from_service.message("success", res?.data?.message);
        }
      }
    );
  }

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
          filteredData?.length > 0 ? filteredData : data_table,
          loading.table
        )}
        {from_service.model(
          "View",
          openModal.type === "view",
          null,
          () => closePopup(),
          1200,
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
              <div className="view_model_form col_1 g_25">
                <div className="col_1 g_15">
                  <div className="col_1 g_15">
                    <div className="col_1 bg_box_head">
                      <h3>General Settings</h3>
                    </div>
                  </div>
                  <div className="col_3 g_20 col_2_xl col_1_sm">
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Product Name",
                        list_single?.product_name
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Category",
                        list_single?.category
                          .map((item) => item.name)
                          .join(", ")
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Brand",
                        list_single?.brand?.name
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Tags",
                        list_single?.tags.map((item) => item.name).join(", ")
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal("SKU", list_single?.sku)}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal("MRP", list_single?.mrp)}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal("SP", list_single?.sp)}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Tax",
                        list_single?.tax?.name
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Adtional Discount",
                        list_single?.discount
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Short Description",
                        list_single?.product_short_description
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Description",
                        list_single?.product_description
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Purchase Notes",
                        list_single?.purchase_notes
                      )}
                    </div>
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 g_15">
                    <div className="col_1 bg_box_head">
                      <h3>Other Details</h3>
                    </div>
                  </div>
                  <div className="col_4 g_20 col_2_xl col_1_sm">
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Hot Sales",
                        list_single?.hot_sale === true ? "Yes" : "No"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Featured Product",
                        list_single?.featured_product === true ? "Yes" : "No"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Popular Product",
                        list_single?.popular_product === true ? "Yes" : "No"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.formviewnormal(
                        "Hot Sales",
                        list_single?.stock_status === true
                          ? "InStock"
                          : "Out of Stock"
                      )}
                    </div>
                  </div>
                </div>
                <div className="col_1 g_5">
                  <div className="col_1 g_15">
                    <div className="col_1 bg_box_head">
                      <h3>Product Specification</h3>
                    </div>
                  </div>
                  <div className="col_1 g_10">
                    {list_single?.specification?.map((e) => (
                      <div key={e._id}>
                        {from_service.formviewnormal(e?.name, e?.description)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 g_15">
                    <div className="col_1 bg_box_head">
                      <h3>Product Image</h3>
                    </div>
                  </div>
                  <div className="col_1">
                    <div className="d_f a_i_c f_w_w g_15">
                      {list_single?.image?.map((e) => (
                        <div key={e._id}>
                          <Image
                            src={
                              e.image_path
                                ? `http://localhost:9000/${e.image_path}`
                                : pro
                            }
                            className="t_image_100"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 g_15">
                    <div className="col_1 bg_box_head">
                      <h3>SEO</h3>
                    </div>
                  </div>
                  <div className="col_1 g_10">
                    {from_service.formviewnormal(
                      "Title",
                      list_single?.meta_title
                    )}
                    {from_service.formviewnormal(
                      "Description",
                      list_single?.meta_description
                    )}
                    {from_service.formviewnormal(
                      "Keywords",
                      list_single?.meta_keywords
                    )}
                  </div>
                </div>
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
              <div className="col_1 g_25">
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>General Settings</h3>
                  </div>

                  <div className="col_3 g_20 col_2_xl col_1_sm">
                    <div className="col_1">
                      {from_service.input(
                        "Product Name",
                        "product_name",
                        true,
                        "Product name is required"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.select(
                        "Category",
                        "category",
                        false,
                        "",
                        c_option,
                        null,
                        null,
                        "tags"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.select(
                        "Brand",
                        "brand",
                        false,
                        "",
                        b_option
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.select(
                        "Tags",
                        "tags",
                        false,
                        "",
                        t_option,
                        null,
                        null,
                        "tags"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.input(
                        "SKU",
                        "sku",
                        true,
                        "SKU is required"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.number(
                        "MRP",
                        "mrp",
                        true,
                        "MRP is required"
                      )}
                    </div>

                    <div className="col_1">
                      {from_service.number("SP", "sp", false, "")}
                    </div>
                    <div className="col_1">
                      {from_service.select("Tax", "tax", false, "", tax_option)}
                    </div>
                    <div className="col_1">
                      {from_service.number(
                        "Addtional Discount",
                        "discount",
                        false,
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col_2 g_20 col_1_sm">
                    <div className="col_1">
                      {from_service.textarea(
                        "Short Description",
                        "product_short_description",
                        false,
                        ""
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.textarea(
                        "Description",
                        "product_description",
                        false,
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col_1">
                    {from_service.textarea(
                      "Purchase Notes",
                      "purchase_notes",
                      false,
                      ""
                    )}
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Other Details</h3>
                  </div>
                  <div className="col_4 g_20 col_2_xl col_1_sm">
                    <div className="col_1">
                      {from_service.switch("Hot Sale", "hot_sale", false)}
                    </div>
                    <div className="col_1">
                      {from_service.switch(
                        "Featured Product",
                        "featured_product",
                        false
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.switch(
                        "Popular Product",
                        "popular_product",
                        false
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.switch(
                        "Stock Status",
                        "stock_status",
                        false
                      )}
                    </div>
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Product Specification</h3>
                  </div>
                  <div className="col_1 g_20 col_2_xl col_1_sm">
                    <label className="">Specification</label>
                    <Form.List name="specification">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <div
                              key={key}
                              className="col_2 g_20 col_1_sm new_set_field"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Specification name is required",
                                  },
                                ]}
                                className="col_1"
                              >
                                <Input placeholder="Spec Name" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "description"]}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Specification description is required",
                                  },
                                ]}
                                className="col_1"
                              >
                                <Input placeholder="Spec Description" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                                className="remove_field"
                              />
                            </div>
                          ))}
                          {fields.length < 20 ? (
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Specification
                              </Button>
                            </Form.Item>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    </Form.List>
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Product Images</h3>
                  </div>
                  <div className="col_1">
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
                        {fileList.length >= 5 ? null : uploadButton}
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
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>SEO</h3>
                  </div>
                  <div className="col_1 g_20">
                    <div className="col_1">
                      {from_service.input(
                        "Meta Title",
                        "meta_title",
                        false,
                        ""
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.textarea(
                        "Meta Description",
                        "meta_description",
                        false,
                        ""
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.textarea(
                        "Meta Keywords",
                        "meta_keywords",
                        false,
                        ""
                      )}
                    </div>
                  </div>
                </div>
                {from_service.button(
                  "primary",
                  "submit",
                  "Create",
                  loading.create
                )}
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
              <div className="col_1 g_25">
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>General Settings</h3>
                  </div>

                  <div className="col_3 g_20 col_2_xl col_1_sm">
                    <div className="col_1">
                      {from_service.input(
                        "Product Name",
                        "product_name",
                        true,
                        "Product name is required"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.select(
                        "Category",
                        "category",
                        false,
                        "",
                        c_option,
                        null,
                        null,
                        "tags"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.select(
                        "Brand",
                        "brand",
                        false,
                        "",
                        b_option
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.select(
                        "Tags",
                        "tags",
                        false,
                        "",
                        t_option,
                        null,
                        null,
                        "tags"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.input(
                        "SKU",
                        "sku",
                        true,
                        "SKU is required"
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.number(
                        "MRP",
                        "mrp",
                        true,
                        "MRP is required"
                      )}
                    </div>

                    <div className="col_1">
                      {from_service.number("SP", "sp", false, "")}
                    </div>
                    <div className="col_1">
                      {from_service.select("Tax", "tax", false, "", tax_option)}
                    </div>
                    <div className="col_1">
                      {from_service.number(
                        "Addtional Discount",
                        "discount",
                        false,
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col_2 g_20 col_1_sm">
                    <div className="col_1">
                      {from_service.textarea(
                        "Short Description",
                        "product_short_description",
                        false,
                        ""
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.textarea(
                        "Description",
                        "product_description",
                        false,
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col_1">
                    {from_service.textarea(
                      "Purchase Notes",
                      "purchase_notes",
                      false,
                      ""
                    )}
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Other Details</h3>
                  </div>
                  <div className="col_4 g_20 col_2_xl col_1_sm">
                    <div className="col_1">
                      {from_service.switch(
                        "Hot Sale",
                        "hot_sale",
                        list_single?.hot_sale
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.switch(
                        "Featured Product",
                        "featured_product",
                        list_single?.featured_product
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.switch(
                        "Popular Product",
                        "popular_product",
                        list_single?.popular_product
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.switch(
                        "Stock Status",
                        "stock_status",
                        list_single?.stock_status
                      )}
                    </div>
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Product Specification</h3>
                  </div>
                  <div className="col_1 g_20 col_2_xl col_1_sm">
                    <label className="">Specification</label>
                    <Form.List name="specification">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <div
                              key={key}
                              className="col_2 g_20 col_1_sm new_set_field"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Specification name is required",
                                  },
                                ]}
                                className="col_1"
                              >
                                <Input placeholder="Spec Name" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "description"]}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Specification description is required",
                                  },
                                ]}
                                className="col_1"
                              >
                                <Input placeholder="Spec Description" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                                className="remove_field"
                              />
                            </div>
                          ))}
                          {fields.length < 20 ? (
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Specification
                              </Button>
                            </Form.Item>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    </Form.List>
                  </div>
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>Product Images</h3>
                  </div>
                  <div className="col_1">
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
                        onRemove={(e) => onRemove(e)}
                      >
                        {fileList.length >= 5 ? null : uploadButton}
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
                </div>
                <div className="col_1 g_15">
                  <div className="col_1 bg_box_head">
                    <h3>SEO</h3>
                  </div>
                  <div className="col_1 g_20">
                    <div className="col_1">
                      {from_service.input(
                        "Meta Title",
                        "meta_title",
                        false,
                        ""
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.textarea(
                        "Meta Description",
                        "meta_description",
                        false,
                        ""
                      )}
                    </div>
                    <div className="col_1">
                      {from_service.textarea(
                        "Meta Keywords",
                        "meta_keywords",
                        false,
                        ""
                      )}
                    </div>
                  </div>
                </div>
                {from_service.button(
                  "primary",
                  "submit",
                  "Update",
                  loading.update
                )}
              </div>
            </Form>
          </>
        )}
      </div>
    </>
  );
};

export default Products;
