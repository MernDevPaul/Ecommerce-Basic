import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Empty, Popconfirm, message } from "antd";
import pro from "../Assets/Images/pro.png";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import API from '../Api/ApiService';
import {accountStart, accountSuccess, accountFailure} from '../Store/Slice/MyAccountSlice'
const Cart = () => {
  const [loading, setLoading] = useState({
    delete: false,
    update: false
  })
  const api = new API();
  const dispatch = useDispatch();
  const cart_list = useSelector((state) => state?.account?.cartlist?.data);
  //initFunction
  const initFunction = async () => {
    await api.getAll(dispatch, [accountStart, accountSuccess, accountFailure, "cartlist"], "cart", {}, (err, res) => {})
  }
  //init
  useEffect(() => {
    initFunction();
  }, []);

  const handleSubmit = async (id) => {
    setLoading((prev) => ({ ...prev, delete: true }));
    await api.remove(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "cartdelete"],
      "cart",
      id,
      (err, res) => {
        setLoading((prev) => ({ ...prev, delete: false }));
        if (res) {
          message.success(res.data.message);
          initFunction();
        } else {
          message.error(err.response.data.message);
        }
      }
    );
  }

  const handleSubmitDec = async (id, type) => {
    await api.update(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "cartupdate"],
      "cart",
      id,
      { type: type },
      (err, res) => {
        if (res) {
          message.success(res.data.message);
          initFunction();
        } else {
          message.error(err.response.data.message);
        }
      }
    );
  }

  const handleSubmitInc = async (id, type) => {
await api.update(
  dispatch,
  [accountStart, accountSuccess, accountFailure, "cartupdate"],
  "cart",
  id,
  { type: type },
  (err, res) => {
    if (res) {
      message.success(res.data.message);
      initFunction();
    } else {
      message.error(err.response.data.message);
    }
  }
);
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
                title: "Cart",
              },
            ]}
          />
        </div>
      </div>
      <div className="cart_page_section">
        <div className="wrapper">
          <div className="cart_page_align">
            <h1>Cart Page</h1>
            {cart_list?.product?.length === 0 ? (
              <Empty />
            ) : (
              <>
                <div className="cart_page_left">
                  <div className="cart_items">
                    {cart_list?.product?.map((e, index) => {
                      return (
                        <div className="cart_box" key={index}>
                          <div className="cart_box_img">
                            <img
                              src={
                                e?.product_id?.image[0]
                                  ? api.apiUrl +
                                    e?.product_id?.image[0]?.image_path
                                  : pro
                              }
                              alt={e?.product_name}
                            />
                          </div>
                          <div className="cart_box_content">
                            <div className="c_one">
                              <h2>{e?.product_id?.product_name}</h2>
                              <div className="price">
                                {e?.product_id?.sp && (
                                  <div className="sp">
                                    {api.currency + " " + e?.product_id?.sp}
                                  </div>
                                )}
                                {e?.product_id?.mrp && (
                                  <div className="mrp">
                                    {api.currency + " " + e?.product_id?.mrp}
                                  </div>
                                )}
                              </div>
                              <div>
                                {e?.product_id?.discount &&
                                e?.product_id?.discount > 0 ? (
                                  <div className="discount cart">
                                    Addtional discount{" "}
                                    {e?.product_id?.discount > 0 &&
                                      e?.product_id?.discount}
                                    % off
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div className="c_two">
                              <div className="remove_item">
                                <Popconfirm
                                  title=" Are you Sure to delete?"
                                  onConfirm={() => handleSubmit(e?._id)}
                                  okButtonProps={{
                                    loading: loading.delete,
                                  }}
                                >
                                  <DeleteOutlined />
                                </Popconfirm>
                              </div>
                              <div className="quantity">
                                <button
                                  onClick={() =>
                                    handleSubmitDec(e?._id, "minus")
                                  }
                                >
                                  -
                                </button>
                                <input type="text" value={e?.quantity} />
                                <button
                                  onClick={() =>
                                    handleSubmitInc(e?._id, "plus")
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="cart_page_right">
                  <div className="subtotal">
                    <b>SubTotal:</b> {api.currency + " " + cart_list?.total}
                  </div>
                  <div className="tax_label">Taxes calculated at checkout</div>
                  <div className="check_move_btn">
                    <Link to={"/checkout"}>
                      <Button htmlType="button">Checkout</Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart