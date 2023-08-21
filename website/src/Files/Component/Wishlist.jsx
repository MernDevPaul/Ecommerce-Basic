import React, { useEffect } from "react";
import { Breadcrumb, Empty, Rate, message } from "antd";
import pro from "../Assets/Images/pro.png";
import { Link } from "react-router-dom";
import wish from "../Assets/Images/close.png";
import { useSelector,useDispatch } from "react-redux";
import API from "../Api/ApiService";
import {accountStart,accountSuccess,accountFailure} from "../Store/Slice/MyAccountSlice";
const Wishlist = () => {
  const wishlist = useSelector(
    (state) => state?.account?.wishlist?.data?.wishlist
  );
  const api = new API();
  //initFunction
  const dispatch = useDispatch();
  const initFunction = async () => {
     if (api.webtoken !== "" && Boolean(api.isbuyer) === true) {
       await api.getAll(
         dispatch,
         [accountStart, accountSuccess, accountFailure, "wishlist"],
         "wishlist",
         {},
         (err, res) => {}
       );
     }
  }
  useEffect(()=>{
    initFunction();
  },[])
  const deleteWish = async (e) => {
    await api.update(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "wishlistdelete"],
      "wishlist",
      "",
      { id: e },
      (err, res) => {
        initFunction();
        if (res) {
          message.success(res.data.message);
        } else {
          message.error(err.response.data.message);
        }
      }
    );
  }
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
                title: "Wishlist",
              },
            ]}
          />
        </div>
      </div>
      <div className="wishlist_page">
        <div className="wrapper">
          <div className="wishlist_page_align">
            <h1>Wishlist</h1>
            {
              wishlist?.length>0?(
                <div className="col_4 g_25 col_3_xl col_2_lg col_1_sm">
              {wishlist?.map((e, i) => {
                return (
                  <div className="product_box" key={e?._id}>
                    <Link to={"/product/" + e?.slug} title={e?.product_name}>
                      <div className="product_img">
                        <img
                          src={
                            e.image[0]
                              ? api.apiUrl + e?.image[0]?.image_path
                              : pro
                          }
                          alt={e?.product_name}
                        />
                        <div className="hover_img">
                          <img
                            src={
                              e?.image[1]
                                ? api.apiUrl + e?.image[1]?.image_path
                                : api.apiUrl + e?.image[0]?.image_path
                                ? api.apiUrl + e?.image[0]?.image_path
                                : pro
                            }
                            alt={e?.product_name}
                          />
                        </div>
                      </div>
                    </Link>
                    <div className="product_details">
                      <h5>{e?.category[0]?.name}</h5>
                      <p>{e?.product_name}</p>
                      <div className="rating">
                        <Rate allowHalf defaultValue={4.5} />
                      </div>
                      <div className="price">
                        {e?.sp && (
                          <div className="sp">{api.currency + " " + e?.sp}</div>
                        )}
                        {e?.mrp && (
                          <div className="mrp">
                            {api.currency + " " + e?.mrp}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="wishlist_close" onClick={()=>deleteWish(e?._id)}>
                      <img src={wish} alt="wishlist" />
                    </div>
                  </div>
                );
              })}
            </div>
              ):(
                <Empty />
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
