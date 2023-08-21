import React, { useState, useEffect } from "react";
import { Checkbox, Button, Modal, Popconfirm, message,Radio } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AddAddressPopup from "./AddAddressPopup";
import API from "../Api/ApiService";
import { useDispatch,useSelector } from "react-redux";
import {accountStart, accountSuccess, accountFailure} from '../Store/Slice/MyAccountSlice'
import EditAddressPopup from "./EditAddressPopup";
const MyAddress = () => {
  const [loading, setLoading] = useState({
    getaddress: false,
    deleteaddress: false,
    getsingleaddress: false,
  });
  const [selectedId, setSelectedId] = useState(null);
  const api = new API();
  const dispatch = useDispatch();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isModalOpen1, setIsModalOpen1] = useState(false);
   const showModal = () => {
     setIsModalOpen(true);
   };
   const handleOk = () => {
     setIsModalOpen(false);
   };
  const handleCancel1 = (type) => {
    initFunction();
     setIsModalOpen(type);
  };
  const handleCancel4 = () => {
    setIsModalOpen1(false);
  };
  const showModal2 = async (e, id) => {
    await api.getSingle(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "addresssingle"],
      "deliveryaddress",
      id,
      (err, res) => {
        console.log("res", res);
        console.log("err", err);
      }
    );
    setIsModalOpen1(e);
  };
  const handleOk1 = () => {
    setIsModalOpen1(false);
  };
  const handleCancel3 = (type) => {
    initFunction();
    setIsModalOpen1(type);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const address_list = useSelector((state) => state?.account?.getaddress?.data);
  //init function
  const initFunction = async () => {
    await api.getAll(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "getaddress"],
      "deliveryaddress",
      {},
      (err, res) => {}
    );
  }
  //init
  useEffect(() => {
    initFunction();
  }, []);

  //delete address
  const handleSubmit = async (e,type) => {
    if (type === "delete") {
      setLoading((prev) => ({ ...prev, deleteaddress: true }));
      await api.remove(dispatch, [
        accountStart,
        accountSuccess,
        accountFailure,
        "addressdelete",
        ],
        "deliveryaddress",
        e,
        (err, res) => {
          if (res) {
            message.success(res.data.message);
            initFunction();
            setLoading((prev) => ({ ...prev, deleteaddress: false }));
          } else {
            message.error(err.response.data.message);
            setLoading((prev) => ({ ...prev, deleteaddress: false }));
          }
        },
      );
    }
  }

  const onChange = async (e) => {
    await api.update(dispatch, [
      accountStart,
      accountSuccess,
      accountFailure,
      "addressdefault",
    ],
      "deliveryaddress",
      "",
      { id: e },
      (err, res) => {
        if (res) {
          message.success(res.data.message);
          initFunction();
          setSelectedId(res?.data?.data?._id);
        } else {
          message.error(err.response.data.message);
        }
      }
    );
  }
  return (
    <>
      <div className="address_items">
          {address_list?.map((e, index) => {
            return (
              <div className="address_box" key={index}>
                <div className="address_box_left">
                  <h4>
                    {e?.name && e?.name}{" "}
                    {e?.phone ? " - " + e?.phone : " - " + e?.alternate_number}
                  </h4>
                  <p>
                    {e?.address && e?.address}
                    {e?.city && ", " + e?.city}
                    {e?.state && ", " + e?.state}
                    {e?.country && ", " + e?.country}
                    {e?.pincode && " - " + e?.pincode}
                  </p>
                  <Checkbox
                    checked={e?.is_default}
                    onChange={() => onChange(e._id)}
                  ></Checkbox>
                </div>
                <div className="address_box_right">
                  <div
                    className="edit"
                    onClick={() => showModal2(true, e?._id)}
                  >
                    <EditOutlined />
                  </div>
                  <div className="delete">
                    <Popconfirm
                      title=" Are you Sure to delete?"
                      onConfirm={() => handleSubmit(e?._id, "delete")}
                      okButtonProps={{
                        loading: loading.delete,
                      }}
                    >
                      <DeleteOutlined />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            );
          })}
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            htmlType="button"
            onClick={showModal}
          >
            Add Address
          </Button>
        </div>
      <Modal
        title="Add Address"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <AddAddressPopup handleCancel1={handleCancel1} />
      </Modal>
      <Modal
        title="Edit Address"
        open={isModalOpen1}
        onOk={handleOk1}
        onCancel={handleCancel4}
        footer={null}
        width={600}
      >
        <EditAddressPopup handleCancel3={handleCancel3} />
      </Modal>
    </>
  );
}

export default MyAddress