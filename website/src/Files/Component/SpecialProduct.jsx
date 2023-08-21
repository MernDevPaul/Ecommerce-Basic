import React from 'react'
import pro from "../Assets/Images/pro.png";
import { Rate, Empty } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Helper from "../Api/Helper";
import API from "../Api/ApiService";
const SpecialProduct = () => {
  const popular_product = useSelector((state) => state?.common?.popularlist?.data);
  const api = new API();
  const shuffledCategories = Helper.randomItem(popular_product).slice(0, 4);
  let product = [];
  for (let i = 0; i < shuffledCategories.length; i++) {
    const e = shuffledCategories[i];
    product.push(
      <div className="two_box" key={e?._id}>
        <div className="two_left">
          <img
            src={e.image[0] ? api.apiUrl + e?.image[0]?.image_path : pro}
            alt={e?.product_name}
          />
        </div>
        <div className="two_right">
          <h5>{e?.category[0]?.name}</h5>
          <h2>{e?.product_name}</h2>
          <div className="rating">
            <Rate allowHalf defaultValue={4.5} disabled />
          </div>
          <div className="price">
            {e?.sp && <div className="sp">{api.currency + " " + e?.sp}</div>}
            {e?.mrp && <div className="mrp">{api.currency + " " + e?.mrp}</div>}
          </div>
          {e?.sp && (
            <div className="offer_label">
              {(((e?.mrp - e?.sp) / e?.mrp) * 100).toFixed(0)}% off
            </div>
          )}
          <Link to={"/product/" + e?.slug} title={e?.product_name}>
            <button>Show Now</button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="section">
        <div className="wrapper">
          <div className="head_text">
            <h2>Popular Products</h2>
          </div>
          {shuffledCategories.length > 0 ? (
            <div className="col_2 g_20 col_1_md">{product}</div>
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </>
  );
}

export default SpecialProduct;