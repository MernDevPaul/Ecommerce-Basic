import React from "react";
import { Link } from "react-router-dom";
import blog from "../Assets/Images/blog.jpg";
import { useSelector } from "react-redux";
import { Empty } from "antd";
import Helper from "../Api/Helper";
import API from "../Api/ApiService";
import datejs from "datejs";
import { Navigation, Thumbs, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const Blog = () => {
  const blog_list = useSelector((state) => state?.common?.bloglist?.data);
  const api = new API();
  const shuffledCategories = Helper.randomItem(blog_list).slice(0, 4);
  return (
    <>
      <div className="section blog_section">
        <div className="wrapper">
          <div className="head_text">
            <h2>Our Latest Blogs</h2>
          </div>
          {blog_list ? (
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
              {shuffledCategories.map((e, i) => {
                return (
                  <SwiperSlide key={i}>
                    <div className="blog_box">
                      <div className="blog_image">
                        <img
                          src={e.image ? api.apiUrl + e?.image : blog}
                          alt={e?.title}
                        />
                      </div>
                      <div className="blog_content">
                        <h5>
                          {e && e.createdAt
                            ? new Date(e.createdAt).toString("d MMM, yyyy")
                            : ""}
                        </h5>
                        <h2>{e?.title}</h2>

                        <div
                          dangerouslySetInnerHTML={{ __html: e?.description }}
                        />

                        <Link to={"/blog/" + e?.slug} title="Read More">
                          <button>Read More</button>
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
};

export default Blog;
