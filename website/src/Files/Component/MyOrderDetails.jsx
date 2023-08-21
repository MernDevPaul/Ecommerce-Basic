import React, { useEffect } from "react";
import { Timeline, Button, Result } from "antd";
import pro from '../Assets/Images/pro.png'
import { useDispatch, useSelector } from "react-redux";
import { accountStart, accountSuccess, accountFailure } from '../Store/Slice/MyAccountSlice'
import API from '../Api/ApiService';
import { useParams, Link } from "react-router-dom";
import datejs from "datejs";
import jsPDF from "jspdf";

const MyOrderDetails = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const api = new API();
  const myorder_single = useSelector((state) => state?.account?.myordersingle?.data);
  //initFunction
  const initFunction = async () => {
    await api.getSingle(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "myordersingle"],
      "myorder",
      params?.id,
      (err, res) => {
        if (err) {
          dispatch(accountFailure());
          dispatch(accountSuccess({ type: "myordersingle", data: null }));
        }
      }
    );
  }
  console.log("myorder_single", myorder_single);
  //init
  useEffect(() => {
    initFunction();
  }, []);

  
    
  const handleDownload = async () => {
    let doc = new jsPDF("l", "mm", [1500, 1400]);

    const invoice = (
      <div class="">
        <h1>Learning Computer Science</h1>

        <p class="">
          CPP:
          <br />
          My first implementation was in this
        </p>
        <p class="">
          ALGO:
          <br />
          Algorithms are fun
        </p>
        <p class="">
          TYPESCRIPT:
          <br />
          New technology
        </p>
        <p class="">
          JAVASCRIPT:
          <br />
          Client side programming
        </p>
      </div>
    );

     doc.html(invoice, {
       callback: function (doc) {
         doc.save("invoice.pdf");
       },
       x: 12,
       y: 12,
     });
  };
  return (
    <>
      {myorder_single ? (
        <div className="order_details">
          <div className="order_details_left">
            <h4>
              Order Item{myorder_single?.order?.product?.length <= 1 ? "" : "s"}
            </h4>
            <div className="order_details_items">
              {myorder_single?.order?.product?.map((e, index) => {
                return (
                  <div className="order_details_items_box">
                    <div className="order_details_img">
                      <img
                        src={e?.image ? `${api.apiUrl + e?.image[0]}` : pro}
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
                  {myorder_single?.order?.cart_sub_total}
                </p>
                <p>
                  <b>Tax: </b>
                  {myorder_single?.order?.cart_tax}
                </p>
                <p>
                  <b>Discount: </b>
                  {" - "+myorder_single?.order?.cart_total_discount}
                </p>
                <hr />

                <p>
                  <b>Grand Total: </b>
                  {api.currency + " " + myorder_single?.order?.cart_amount}
                </p>
              </div>
            </div>
          </div>
          <div className="order_details_right">
            <div className="order_details_right_box">
              <h4>Summery</h4>
              <p>
                <b>Order No:</b> {myorder_single?.order?.order_no}
              </p>
              <p>
                <b>Order Date:</b>{" "}
                {new Date(
                  myorder_single?.order?.created_at
                ).toLocaleDateString() +
                  " - " +
                  new Date(
                    myorder_single?.order?.created_at
                  ).toLocaleTimeString()}
              </p>
              <p>
                <b>Order Status:</b> {myorder_single?.order?.order_status}
              </p>
              <p>
                <b>Order Total:</b>{" "}
                {api.currency + " " + myorder_single?.order?.cart_amount}
              </p>
              {/* <p>
                <b>Order Invioce:</b>{" "}
                <Button type="primary" size="small" onClick={handleDownload}>
                  Download
                </Button>
              </p> */}
            </div>
            <div className="order_details_right_box">
              <h4>Shipping Address</h4>
              <p>
                {myorder_single?.order?.delivery_address?.address}
                {myorder_single?.order?.delivery_address?.city &&
                  ", " + myorder_single?.order?.delivery_address?.city}
                {myorder_single?.order?.delivery_address?.state &&
                  ", " + myorder_single?.order?.delivery_address?.state}
                {myorder_single?.order?.delivery_address?.country &&
                  ", " + myorder_single?.order?.delivery_address?.country}
                {myorder_single?.order?.delivery_address?.pincode &&
                  " - " + myorder_single?.order?.delivery_address?.pincode}
                <br />
                {myorder_single?.order?.delivery_address?.landmark &&
                  "Landmark: " +
                    myorder_single?.order?.delivery_address?.landmark}
                <br />
                {myorder_single?.order?.delivery_address?.phone &&
                  "Contact No: " +
                    myorder_single?.order?.delivery_address?.phone}
                <br />
                {myorder_single?.order?.delivery_address?.alternate_number &&
                  "Alternate No: " +
                    myorder_single?.order?.delivery_address?.alternate_number}
                <br />
                {myorder_single?.order?.delivery_address?.email &&
                  "Email ID: " + myorder_single?.order?.delivery_address?.email}
                <br />
                {myorder_single?.order?.delivery_address?.name &&
                  "Name: " + myorder_single?.order?.delivery_address?.name}
              </p>
            </div>
            <div className="order_details_right_box">
              <h4>Order Status</h4>
              <Timeline
                mode={"left"}
                items={myorder_single?.order_logs?.map((e, index) => {
                  return {
                    label: new Date(e?.created_at).toDateString(),
                    children: e?.order_status,
                  };
                })}
              />
            </div>
          </div>
        </div>
      ) : (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link to="/">
              <Button type="primary">Back Home</Button>
            </Link>
          }
        />
      )}
    </>
  );
}

export default MyOrderDetails