import React, { useEffect, useState } from "react";
import BreadcrumbDynamic from "../../Api/BreadcrumbDynamic";
import { Button, DatePicker, Form, Spin, Tag, Timeline } from "antd";
import { useSelector, useDispatch } from "react-redux";
import default_img from "../../Assets/Images/pro.png";
import {
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import API from "../../Api/ApiService";
import FormService from "../../Api/FormsService";
import {
  orderStart,
  orderSuccess,
  orderFailure,
} from "../../Redux/Slice/OrderSlice";
import {
  usersStart,
  usersSuccess,
  usersFailure,
} from "../../Redux/Slice/UsersSlice";
import {
  productsStart,
  productsSuccess,
  productsFailure,
} from "../../Redux/Slice/ProductsSlice";
import datejs from "datejs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const { RangePicker } = DatePicker;
const Order = ({ title }) => {
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
  const [formFilter] = Form.useForm();
  const [formEdit] = Form.useForm();
  const dispatch = useDispatch();
  const lists = useSelector((state) => state?.order?.orderlist?.data);
  const list_single = useSelector((state) => state?.order?.ordersingle?.data);
  const p_list = useSelector((state) => state?.products?.productslist?.data);
  const b_list = useSelector((state) => state?.users?.userslist?.data);

  //select
  const buyer_option = b_list?.map((item) => {
    return {
      label: item?.name,
      value: item?._id,
    };
  });

  const product_option = p_list?.map((item) => {
    return {
      label: item?.product_name,
      value: item?._id,
    }
  });



  const [openModal, setOpenModal] = useState({
    type: "", // 'create' or 'edit' or 'delete' or 'deletemany'
    visible: false,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  //excel download
  const handleDownload = () => {
    
    const data = [
      [
        "S no",
        "Order No",
        "Buyer Name",
        "Buyer Email",
        "Buyer Phone",
        "Shipping Address",
        "Shipping Contact No",
        "Shipping Email Id",
        "Shipping Alternate No",
        "Total Quantity",
        "Sub Total",
        "Tax",
        "Total Amount",
        "Status",
        "Order Date",
        "Paymeny Status",
        "Invoice No",
        "Razorpay Order Id",
        "Razorpay Payment Id",
        "Razorpay Signature",
        "Products Items",
        "Order Logs",
      ],
    ];
    lists?.map((item,i) => {
      const e = item?.order;
      data.push([
        i + 1,
        e?.order_no,
        e?.buyer_id?.name,
        e?.buyer_id?.email,
        e?.buyer_id?.phone,
        e?.delivery_address?.address +
          ", " +
          e?.delivery_address?.city +
          ", " +
          e?.delivery_address?.state +
          ", " +
          e?.delivery_address?.country +
          " - " +
          e?.delivery_address?.pincode,
        e?.delivery_address?.phone,
        e?.delivery_address?.email,
        e?.delivery_address?.alternate_number,
        e?.cart_total_quantity,
        e?.cart_sub_total,
        e?.cart_tax,
        e?.cart_amount,
        e?.order_status,
        new Date(e?.order_date).toDateString(),
        e?.payment_status,
        e?.invoice_no,
        e?.razorpay_order_id,
        e?.razorpay_payment_id,
        e?.razorpay_signature,
        e?.product
          ?.map((a) => {
            return (
              "Product Name: " +
                a?.product_name +
                "Quantity: " +
                a?.quantity +
                "Tax: " +
                a?.tax +
                "Total: " +
                a?.total +
                "Mrp: " +
                a?.mrp +
                "Sp: " +
                a?.sp ?? ""
            );
          })
          .join(" | "),
        item?.order_logs
          ?.map((a) => {
            return (
              "Order Status: " +
              a?.order_status +
              "Order Date: " +
              new Date(a?.created_at).toDateString()
            );
          })
          .join(" | "),
      ]);
    });

    // Create a new workbook and add the data to it
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate a Blob containing the Excel file
    const excelBlob = new Blob(
      [s2ab(XLSX.write(workbook, { bookType: "xlsx", type: "binary" }))],
      {
        type: "application/octet-stream",
      }
    );

    // Trigger the download using FileSaver.js
    saveAs(excelBlob, "orders.xlsx");
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };


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
      [orderStart, orderSuccess, orderFailure, "orderlist"],
      "order",
      {},
      (err, res) => {
        setLoading((prev) => ({ ...prev, table: false }));
      }
    );
    await api.getAll(
      dispatch,
      [usersStart, usersSuccess, usersFailure, "userslist"],
      "buyer",
      {},
      (err, res) => {
        console.log("res", res);
        setLoading((prev) => ({ ...prev, table: false }));
      }
    );
    await api.getAll(
      dispatch,
      [productsStart, productsSuccess, productsFailure, "productslist"],
      "product",
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
    console.log("values", values);
    if (actionType === "edit") {
      setLoading((prev) => ({ ...prev, edit: true }));
      await api.getSingle(
        dispatch,
        [orderStart, orderSuccess, orderFailure, "ordersingle"],
        "order",
        values,
        (err, res) => {
          if (err) {
            from_service.message("error", err?.response?.data?.message);
            setLoading((prev) => ({ ...prev, edit: false }));
          } else {
            setLoading((prev) => ({ ...prev, edit: false }));
            formEdit.setFieldsValue(res?.data?.data?.order);
            setOpenModal({ type: "edit", visible: true });
          }
        }
      );
    } else if (actionType === "update") {
      setLoading((prev) => ({ ...prev, update: true }));
      await api.update(
        dispatch,
        [orderStart, orderSuccess, orderFailure, "orderedit"],
        "order",
        list_single?.order?._id,
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
    } else if (actionType === "view") {
      setLoading((prev) => ({ ...prev, view: true }));
      await api.getSingle(
        dispatch,
        [orderStart, orderSuccess, orderFailure, "ordersingle"],
        "order",
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
    key: e.order?._id ?? "",
    orderno: e.order?.order_no ?? "",
    amount: e?.order?.cart_amount ?? "",
    payment:
      e?.order?.payment_status === "success" ? (
        <Tag color="green">Success</Tag>
      ) : (
        <Tag color="red">Failed</Tag> ?? ""
      ),
    contact: e?.order?.delivery_address?.phone
      ? e?.order?.delivery_address?.phone
      : e?.order?.delivery_address?.alternate_number ?? "",
    orderdate: new Date(e?.order?.created_at).toDateString() ?? "",
    status: [e?.order?.order_status ?? ""],
    action: e?.order?._id ?? "",
  }));
  const columns = [
    {
      title: "Order No",
      dataIndex: "orderno",
      ...from_service.tableService("orderno"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      ...from_service.tableService("amount"),
    },
    {
      title: "Order Date",
      dataIndex: "orderdate",
      ...from_service.tableService("orderdate"),
    },
    {
      title: "Payment Status",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "Contact Person",
      dataIndex: "contact",
      key: "contact",
      ...from_service.tableService("contact"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: from_service.orderStatusTable("status"),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: 85,
      render: (action) => (
        <div className="action_btn_table">
          <p className=" edit" onClick={() => handleSubmit(action, "view")}>
            <EyeOutlined />
          </p>
          <p className=" edit" onClick={() => handleSubmit(action, "edit")}>
            <EditOutlined />
          </p>
        </div>
      ),
    },
  ];

  const handleFilter = async (values) => {
    console.log("values", values);
    await api.getAll(
      dispatch,
      [orderStart, orderSuccess, orderFailure, "orderlist"],
      "order",
      values,
      (err, res) => {
        if (err) {
          console.log("err", err);
        } else {
          console.log("res", res);
        }
      }
    )
  }
  return (
    <>
      <BreadcrumbDynamic title={title} />
      <div className="bg_box p_20">
        <div className="action_head a_i_f_s">
          <div className="action_head_left m_w_75_p">
            <Form form={formFilter} onFinish={(e) => handleFilter(e)}>
              <div className="col_3 g_20 col_2_xl col_1_sm">
                <div className="col_1">
                  {from_service.select(
                    "",
                    "buyer_id",
                    "",
                    "",
                    buyer_option,
                    null,
                    null,
                    null,
                    "Select Buyer"
                  )}
                </div>
                <div className="col_1">
                  {from_service.select(
                    "",
                    "product_id",
                    "",
                    "",
                    product_option,
                    null,
                    null,
                    null,
                    "Select Product"
                  )}
                </div>
                <div className="col_1">
                  <Form.Item name={"date"} className="w_100_p">
                    <RangePicker className="w_100_p" />
                  </Form.Item>
                </div>
                <div className="col_1">
                  {from_service.input("", "min", "", "", "Minimum Amount")}
                </div>
                <div className="col_1">
                  {from_service.input("", "max", "", "", "Maximum Amount")}
                </div>
                <div className="col_1">
                  {from_service.button("primary", "submit", "Filter", false)}
                </div>
              </div>
            </Form>
          </div>
          <div className="action_head_right">
            <Button type="primary" onClick={() => handleDownload()}>
              Excel
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
              <div className="order_details">
                <div className="order_details_left">
                  <h4>
                    Order Item
                    {list_single?.order?.product?.length <= 1 ? "" : "s"}
                  </h4>
                  <div className="order_details_items">
                    {list_single?.order?.product?.map((e, index) => {
                      return (
                        <div className="order_details_items_box">
                          <div className="order_details_img">
                            <img
                              src={
                                e?.image
                                  ? `${api.apiUrl + e?.image[0]}`
                                  : default_img
                              }
                              alt={e?.product_name}
                            />
                          </div>
                          <div className="order_details_content">
                            <div className="o_left">
                              <h4>{e?.product_name}</h4>
                            </div>
                            <div className="o_right">
                              <p>
                                <b>SubTotal: </b>
                                {e?.quantity + " x " + e?.total}
                              </p>
                              <p>
                                <b>Tax: </b>
                                {e?.tax}
                              </p>
                              <p>
                                <b>Total: </b>
                                {e?.total + e?.tax}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="order_details_final_total">
                      <p>
                        <b>SubTotal: </b>
                        {list_single?.order?.cart_sub_total}
                      </p>
                      <p>
                        <b>Tax: </b>
                        {list_single?.order?.cart_tax}
                      </p>
                      <p>
                        <b>Discount: </b>
                        {" - " + list_single?.order?.cart_total_discount}
                      </p>
                      <hr />
                      <p>
                        <b>Grand Total: </b>
                        {api.currency + " " + list_single?.order?.cart_amount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="order_details_right">
                  <div className="order_details_right_box">
                    <h4>Summery</h4>
                    <p>
                      <b>Order No:</b> {list_single?.order?.order_no}
                    </p>
                    <p>
                      <b>Order Date:</b>{" "}
                      {new Date(
                        list_single?.order?.created_at
                      ).toLocaleDateString() +
                        " - " +
                        new Date(
                          list_single?.order?.created_at
                        ).toLocaleTimeString()}
                    </p>
                    <p>
                      <b>Order Status:</b> {list_single?.order?.order_status}
                    </p>
                    <p>
                      <b>Order Total:</b>{" "}
                      {api.currency + " " + list_single?.order?.cart_amount}
                    </p>
                    {/* <p>
                      <b>Order Invioce:</b>{" "}
                      <Button
                        type="primary"
                        size="small"
                        // onClick={handleDownload}
                      >
                        Download
                      </Button>
                    </p> */}
                  </div>
                  <div className="order_details_right_box">
                    <h4>Shipping Address</h4>
                    <p>
                      {list_single?.order?.delivery_address?.address}
                      {list_single?.order?.delivery_address?.city &&
                        ", " + list_single?.order?.delivery_address?.city}
                      {list_single?.order?.delivery_address?.state &&
                        ", " + list_single?.order?.delivery_address?.state}
                      {list_single?.order?.delivery_address?.country &&
                        ", " + list_single?.order?.delivery_address?.country}
                      {list_single?.order?.delivery_address?.pincode &&
                        " - " + list_single?.order?.delivery_address?.pincode}
                      <br />
                      {list_single?.order?.delivery_address?.landmark &&
                        "Landmark: " +
                          list_single?.order?.delivery_address?.landmark}
                      <br />
                      {list_single?.order?.delivery_address?.phone &&
                        "Contact No: " +
                          list_single?.order?.delivery_address?.phone}
                      <br />
                      {list_single?.order?.delivery_address?.alternate_number &&
                        "Alternate No: " +
                          list_single?.order?.delivery_address
                            ?.alternate_number}
                      <br />
                      {list_single?.order?.delivery_address?.email &&
                        "Email ID: " +
                          list_single?.order?.delivery_address?.email}
                      <br />
                      {list_single?.order?.delivery_address?.name &&
                        "Name: " + list_single?.order?.delivery_address?.name}
                    </p>
                  </div>

                  <div className="order_details_right_box">
                    <h4>Buyer Details</h4>
                    <p>
                      {list_single?.order?.buyer_id?.name &&
                        "Name: " + list_single?.order?.buyer_id?.name}
                      <br />
                      {list_single?.order?.buyer_id?.phone &&
                        "Phone No: " + list_single?.order?.buyer_id?.phone}
                      <br />
                      {list_single?.order?.buyer_id?.email &&
                        "Email ID: " + list_single?.order?.buyer_id?.email}
                    </p>
                  </div>

                  <div className="order_details_right_box">
                    <h4>Order Status</h4>
                    <Timeline
                      mode={"left"}
                      items={list_single?.order_logs?.map((e, index) => {
                        return {
                          label: new Date(e?.created_at).toDateString(),
                          children: e?.order_status,
                        };
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
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
              <div className="col_1">
                {from_service.select(
                  "Order Status",
                  "order_status",
                  true,
                  "Order Status is required",
                  [
                    {
                      label: "Packing",
                      value: "Packing",
                    },
                    {
                      label: "Billed",
                      value: "Billed",
                    },
                    {
                      label: "Dispatched",
                      value: "Dispatched",
                    },
                    {
                      label: "Delivered",
                      value: "Delivered",
                    },
                    {
                      label: "Cancelled",
                      value: "Cancelled",
                    },
                  ]
                )}
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

export default Order;
