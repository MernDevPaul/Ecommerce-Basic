import React from 'react'
import defaultImg from '../Assets/Images/banner.png'
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
import API from '../Api/ApiService'
import { Navigation, Thumbs, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const Banner = () => {
  const banner_list = useSelector((state) => state?.common?.bannerlist?.data);
  const api = new API();
  return (
    <>
      <div className="banner_section desktop">
        <div className="wrapper">
          <div className="col_2 w_100_p g_20">
            {banner_list?.slice(0, 1).map((e, i) => {
              return (
                <div className="col_1" key={i}>
                  <div className="banner_cart main">
                    <img
                      src={e?.image ? api.apiUrl + e?.image : defaultImg}
                      alt={e?.title}
                    />
                    <div className="banner_text">
                      <h4>{e?.tagline}</h4>
                      <h2>{e?.title}</h2>
                      <h5>{e?.description}</h5>
                      {e?.button[0] && (
                        <Link
                          to={
                            e?.button[0]?.link !== "undefined"
                              ? e?.button[0]?.link
                              : void 0
                          }
                        >
                          <button>{e?.button[0]?.name}</button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="col_2 g_15">
              {banner_list?.slice(1, 5).map((e, i) => {
                return (
                  <div className="col_1" key={i}>
                    <div className="banner_cart child">
                      <img
                        src={e?.image ? api.apiUrl + e?.image : defaultImg}
                        alt={e?.title}
                      />
                      <div className="banner_text">
                        <h4>{e?.tagline}</h4>
                        <h2>{e?.title}</h2>
                        <h5>{e?.description}</h5>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="banner_section mobile">
        <div className="wrapper">
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
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 1,
                },
                578: {
                  slidesPerView: 1,
                },
                320: {
                  slidesPerView: 1,
                },
              }}
            >
            {banner_list?.map((e, i) => {
              return (
                <SwiperSlide key={i}>
                  <div className="col_1">
                    <div className="banner_cart main">
                      <img
                        src={e?.image ? api.apiUrl + e?.image : defaultImg}
                        alt={e?.title}
                      />
                      <div className="banner_text">
                        <h4>{e?.tagline}</h4>
                        <h2>{e?.title}</h2>
                        <h5>{e?.description}</h5>
                        {e?.button[0] && (
                          <Link
                            to={
                              e?.button[0]?.link !== "undefined"
                                ? e?.button[0]?.link
                                : void 0
                            }
                          >
                            <button>{e?.button[0]?.name}</button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
            
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default Banner