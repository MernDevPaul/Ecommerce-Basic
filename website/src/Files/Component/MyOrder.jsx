import React, { useEffect } from "react";
import { Button, Empty } from 'antd'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { accountStart, accountSuccess, accountFailure } from '../Store/Slice/MyAccountSlice'
import API from '../Api/ApiService';
import datejs from 'datejs'
const MyOrder = () => {
  const dispatch = useDispatch();
  const api = new API();
  const myorder_list = useSelector((state) => state?.account?.myorderlist?.data);

  //initFunction
  const initFunction = async () => {
    await api.getAll(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "myorderlist"],
      "myorder",
      {},
      (err, res) => {}
    );
  }
  //init
  useEffect(() => {
    initFunction();
  },[])
  return (
    <>
      {myorder_list?.length > 0 ? (
        <div className="order_items">
          {
            myorder_list?.map((e, index) => {
              return (
                <div className="order_box" key={index}>
                  <div className="order_box_left">
                    <div>
                      <div className="order_number">
                        <b>Order No:</b> {e?.order_no}
                      </div>
                      <div className="order_date">
                        <b>Order Date:</b>{" "}
                        {new Date(e?.created_at).toLocaleDateString() +
                          " - " +
                          new Date(e?.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <Link to={"/account/my-orderdetails/" + e?._id}>
                      <Button type="primary" size="small">
                        View Details
                      </Button>
                    </Link>
                  </div>
                  <div className="order_box_right">
                    <div className="order_status">{e?.order_status}</div>
                    <div className="order_amount">{api.currency + " " + e?.cart_amount}</div>
                  </div>
                </div>
              );
            })
        }
      </div>
      ): <Empty />}
      
    </>
  );
}

export default MyOrder