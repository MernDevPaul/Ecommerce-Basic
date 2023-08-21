import React, { useEffect } from "react";
import pro from '../Assets/Images/pro.png'
import wish from '../Assets/Images/wishlist.png'
import wishtrue from "../Assets/Images/wish_true.png";
import { Rate, Empty, message } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Helper from "../Api/Helper";
import API from "../Api/ApiService";
import { useDispatch } from "react-redux";
import { accountStart, accountSuccess, accountFailure } from "../Store/Slice/MyAccountSlice";
const FeaturedProduct = () => {
  const product_list = useSelector((state) => state?.common?.featureproductlist?.data);
  const api = new API();
  const shuffledCategories = Helper.randomItem(product_list).slice(0, 8);
  const dispatch = useDispatch();
  const wishlist = useSelector(
    (state) => state?.account?.wishlist?.data?.wishlist
  );
  //initFunction
  const initFunction = async () => {
    if (api.webtoken !== "" && Boolean(api.isbuyer) === true) {
      await api.getAll(
        dispatch,
        [accountStart, accountSuccess, accountFailure, "wishlist"],
        "wishlist",
        {},
        (err, res) => { }
      );
    }
  };

  useEffect(() => {
    initFunction();
  }, []);



  let product = [];
  for (let i = 0; i < shuffledCategories.length; i++) {
    const e = shuffledCategories[i];
    const wish_yes = wishlist?.find((w) => w?._id === e?._id);
    product.push(
      <div className="product_box" key={e?._id}>
        <Link to={"/product/" + e?.slug} title={e?.product_name}>
          <div className="product_img">
            <img
              src={e.image[0] ? api.apiUrl + e?.image[0]?.image_path : pro}
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
            {e?.sp && <div className="sp">{api.currency + " " + e?.sp}</div>}
            {e?.mrp && <div className="mrp">{api.currency + " " + e?.mrp}</div>}
          </div>
        </div>
        {wish_yes !== undefined ? (
          <div className="wishlist">
            <img src={wishtrue} alt="wishlist" className="no_filter" />
          </div>
        ) : (
          <div className="wishlist" onClick={()=>addWish(e?._id)}>
            <img src={wish} alt="wishlist" />
          </div>
        )}
      </div>
    );
  }
  const addWish = async (e) => {
    if (api.webtoken !== "" && Boolean(api.isbuyer) === true) {
    await api.create(dispatch, [
      accountStart,
      accountSuccess,
      accountFailure,
      "wishlistadd",
    ],
      "wishlist",
      { id: e },
      (err, res) => {
        if (res) {
          message.success(res.data.message);
          initFunction();
        } else {
          message.error(err.response.data.message);
        }
      }
    );
    } else {
      message.warning("Please Login");
    }
  }
  return (
    <>
      <div className="section">
        <div className="wrapper">
          <div className="head_text">
            <h1>Featured Collection</h1>
          </div>
          {shuffledCategories.length > 0 ? (
            <div className="col_4 g_25 col_2_lg g_20_lg col_2_md col_1_sm">{product}</div>
          ): <Empty />}
        </div>
      </div>
    </>
  );
};

export default FeaturedProduct;
