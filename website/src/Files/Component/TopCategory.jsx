import React from 'react'
import categoryImg from '../Assets/Images/category.png'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import API from '../Api/ApiService';
import Helper from '../Api/Helper';
import { Navigation, Thumbs, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const TopCategory = () => {
  const category_list = useSelector((state) => state?.common?.categorylist?.data);
  const api = new API();
  const shuffledCategories = Helper.randomItem(category_list).slice(0, 8);
  return (
    <div className="section">
      <div className="wrapper">
        <div className="top_category col_4 desktop">
          {shuffledCategories?.map((e, i) => {
            return (
              <div className="cat_box" key={i}>
                <Link to={"/category/" + e?.slug} title={e?.name}>
                  <div>
                    <h4>{e?.name}</h4>
                    <h6>Popular</h6>
                  </div>
                  <div>
                    <img
                      src={e?.image ? api.apiUrl + e?.image : categoryImg}
                      alt="category"
                      className="cat_img_height"
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="top_category mobile">
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
                slidesPerView: 1,
              },
              1200: {
                slidesPerView: 1,
              },
              992: {
                slidesPerView: 4,
              },
              768: {
                slidesPerView: 4,
              },
              578: {
                slidesPerView: 3,
              },
              320: {
                slidesPerView: 2,
              },
            }}
          >
            {shuffledCategories?.map((e, i) => {
              return (
                <SwiperSlide key={i}>
                  <div className="cat_box">
                    <Link to={"/category/" + e?.slug} title={e?.name}>
                      <div>
                        <h4>{e?.name}</h4>
                        {/* <h6>10 Items</h6> */}
                      </div>
                      <div>
                        <img
                          src={e?.image ? api.apiUrl + e?.image : categoryImg}
                          alt="category"
                          className="cat_img_height"
                        />
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default TopCategory