import React from "react";
import Marquee from "react-fast-marquee";
import categoryImg from "../Assets/Images/category.png";
import {useSelector} from "react-redux";
import { Link } from "react-router-dom";
import API from "../Api/ApiService";
const Brand = () => {
  const brand_list = useSelector((state) => state?.common?.brandlist?.data);
  const api = new API();
  return (
    <>
      <div className="section">
        <div className="wrapper">
          <div className="p_r_20 o_f_h w_100_p o_f_h brand_align">
            <Marquee className="d_f" pauseOnHover={true} speed={50}>
              <div className="d_f g_50 m_r_50">
                {
                  brand_list?.map((e) => {
                    return (
                      <Link
                        to={e.slug === "" ? void 0 : `/brand/${e.slug}`}
                        key={e?._id}
                      >
                        <img
                          src={e?.image ? api.apiUrl + e?.image : categoryImg}
                          alt={e?.name}
                        />
                      </Link>
                    );
                  })
                }
              </div>
            </Marquee>
          </div>
        </div>
      </div>
    </>
  );
};

export default Brand;
