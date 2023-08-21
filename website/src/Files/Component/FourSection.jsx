import React from 'react'
import pro from "../Assets/Images/pro.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../Api/ApiService";
import { Empty } from 'antd';
import Helper from "../Api/Helper";
import { Navigation, Thumbs, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const FourSection = () => {
  const hot_sale = useSelector((state) => state?.common?.hotsalelist?.data);
  const api = new API();
  const shuffledCategories = Helper.randomItem(hot_sale).slice(0, 4);
  return (
    <>
      <div className="section fourth_section">
        <div className="wrapper">
          {shuffledCategories.length > 0 ? (
            <Swiper
              className="product_slider_thumb"
              spaceBetween={15}
              slidesPerView={3}
              navigation={false}
              pagination={{ clickable: true }}
              modules={[Navigation, Thumbs, Pagination]}
              watchSlidesProgress
              breakpoints={{
                1920: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 4,
                },
                992: {
                  slidesPerView: 3,
                },
                768: {
                  slidesPerView: 2,
                },
                578: {
                  slidesPerView: 2,
                },
                320: {
                  slidesPerView: 1,
                },
              }}
            >
              {shuffledCategories?.map((e, i) => {
                return (
                  <SwiperSlide key={i}>
                    <div className="four_box" key={i}>
                      <div className="four_content">
                        <h5>{e?.category[0]?.name}</h5>
                        <h2>{e?.product_name}</h2>
                        <div className="price">
                          {e?.sp && (
                            <div className="sp">
                              {api.currency + " " + e?.sp}
                            </div>
                          )}
                          {e?.mrp && (
                            <div className="mrp">
                              {api.currency + " " + e?.mrp}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="fout_image">
                        <Link
                          to={"/product/" + e?.slug}
                          title={e?.product_name}
                        >
                          <img
                            src={
                              e.image[0]
                                ? api.apiUrl + e?.image[0]?.image_path
                                : pro
                            }
                            alt={e?.product_name}
                          />
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </>
  );
}

export default FourSection