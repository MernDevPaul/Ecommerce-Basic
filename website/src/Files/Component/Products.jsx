import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Image,
  Rate,
  Avatar,
  List,
  Form,
  Input,
  Result,
  message,
} from "antd";
import { Link } from "react-router-dom";
import pro from "../Assets/Images/pro.png";
import wish from "../Assets/Images/wishlist.png";
import wishtrue from "../Assets/Images/wish_true.png";
import API from "../Api/ApiService";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  commonStart,
  commonSuccess,
  commonFailure,
} from "../Store/Slice/CommonSlice";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  accountStart,
  accountSuccess,
  accountFailure,
} from "../Store/Slice/MyAccountSlice";
import dummy_profile from "../Assets/Images/dummy_profile.png";
import moment from "moment";
const Products = () => {
  const [loading, setLoading] = useState({
    add: false,
    buy: false,
    reviewadd: false,
  });
  const api = new API();
  const [reviewForm] = Form.useForm();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const product = useSelector(
    (state) => state?.common?.singleproductlist?.data?.data
  );
  const rerlated = useSelector((state) => state?.common?.allproductslist?.data);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const cats = product?.category?.map((item) => item?._id);
  const cart_list = useSelector((state) => state?.account?.cartlist?.data);
  const wishlist = useSelector(
    (state) => state?.account?.wishlist?.data?.wishlist
  );
  const review_lsit = useSelector(
    (state) => state?.common?.singleproductlist?.data?.review
  );


  //inutFunction
  const initFunction = async () => {
    await api.getSingle(
      dispatch,
      [
        commonStart,
        commonSuccess,
        commonFailure,
        "singleproductlist",
        params?.name,
      ],
      "productlist/product",
      params?.name,
      (err, res) => {
        if (err) {
           dispatch(commonFailure());
           dispatch(commonSuccess({ type: "singleproductlist", data: null }));
        }
      }
    );
    await api.getAll(
      dispatch,
      [commonStart, commonSuccess, commonFailure, "allproductslist", {}],
      "productlist",
      {},
      (err, res) => {}
    );
    if (api.webtoken !== "" && Boolean(api.isbuyer) === true) {
      await api.getAll(
        dispatch,
        [accountStart, accountSuccess, accountFailure, "wishlist"],
        "wishlist",
        {},
        (err, res) => {}
      );
    }
  };
  //init render
  useEffect(() => {
    initFunction();
  }, [params]);

 
  const addWish = async (e) => {
    if (api.webtoken !== "" && Boolean(api.isbuyer) === true) {
      await api.create(
        dispatch,
        [accountStart, accountSuccess, accountFailure, "wishlistadd"],
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
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getCart = async () => {
    if (api.webtoken !== "" && Boolean(api.isbuyer) === true) {
      await api.getAll(
        dispatch,
        [accountStart, accountSuccess, accountFailure, "cartlist"],
        "cart",
        {},
        (err, res) => {}
      );
    }
  };

 

  const addtoCart = async () => {
    setLoading((prev) => ({ ...prev, add: true }));
    await api.create(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "cartadd"],
      "cart",
      { product_id: product?._id, quantity: quantity },
      (err, res) => {
        if (res) {
          message.success(res.data.message);
        } else {
          message.error(err.response.data.message);
        }
        setLoading((prev) => ({ ...prev, add: false }));
        getCart();
      }
    );
  };

  const buyNow = async () => {
    setLoading((prev) => ({ ...prev, buy: true }));
    await api.create(
      dispatch,
      [accountStart, accountSuccess, accountFailure, "cartadd"],
      "cart",
      { product_id: product?._id, quantity: quantity },
      (err, res) => {
        if (res) {
          message.success(res?.data?.message);
          navigate("/cart");
        } else {
          message.error(err?.response?.data?.message);
        }
        setLoading((prev) => ({ ...prev, buy: false }));
        getCart();
      }
    );
  };

  const addReview = async (values) => {
    setLoading((prev) => ({ ...prev, reviewadd: true }));
    values['product_id'] = product?._id
    if (api?.webtoken === null && api?.isbuyer === null) {
      message.error("Please Login");
    } else {
      await api.create(
        dispatch,
        [accountStart, accountSuccess, accountFailure, "reviewadd"],
        "review",
        values,
        (err, res) => {
          setLoading((prev) => ({ ...prev, reviewadd: false }));
          if (res) {
            message.success(res.data.message);
            reviewForm.resetFields();
          } else {
            message.error(err.response.data.message);
          }
        }
      );
    }
    
  };

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
                title: "Product",
              },
              {
                title:
                  product?.product_name ||
                  "Sorry, the page you visited does not exist.",
              },
            ]}
          />
        </div>
      </div>
      {product ? (
        <div className="product_section">
          <div className="wrapper">
            <div className="product_details_section">
              <div className="product_details_left">
                <Swiper
                  className="product_slider_main"
                  modules={[Navigation, Thumbs]}
                  thumbs={{ swiper: thumbsSwiper }}
                >
                  {product?.image?.map((item) => {
                    return (
                      <SwiperSlide key={item?._id}>
                        <div className="img_box">
                          <Image
                            src={item ? api.apiUrl + item?.image_path : pro}
                            alt="slide"
                            className="preview_img"
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                <Swiper
                  className="product_slider_thumb"
                  spaceBetween={15}
                  slidesPerView={3}
                  navigation={true}
                  modules={[Navigation, Thumbs]}
                  watchSlidesProgress
                  onSwiper={setThumbsSwiper}
                  breakpoints={{
                    1920: {
                      slidesPerView: 4,
                    },
                    768: {
                      slidesPerView: 4,
                    },
                    320: {
                      slidesPerView: 3,
                    },
                  }}
                >
                  {product?.image?.map((item) => {
                    return (
                      <SwiperSlide key={item?._id}>
                        <div className="img_box">
                          <img
                            src={item ? api.apiUrl + item?.image_path : pro}
                            alt="slide"
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              <div className="product_details_right">
                <div className="details_sub_align">
                  <div className="details_sub product_short_description">
                    <h1>{product?.product_name}</h1>
                    <p>{product?.product_short_description}</p>
                  </div>
                  <div className="details_sub p_price">
                    <div className="price">
                      {product?.sp && (
                        <div className="sp">
                          {api.currency + " " + product?.sp}
                        </div>
                      )}
                      {product?.mrp && (
                        <div className="mrp">
                          {api.currency + " " + product?.mrp}
                        </div>
                      )}
                      {product?.discount && product?.discount > 0 ? (
                        <div className="discount">
                          Addtional discount{" "}
                          {product?.discount > 0 &&
                            product?.discount}
                          % off
                        </div>
                      ):""}
                    </div>
                    <Rate allowHalf defaultValue={4.5} />
                    <div className="write_review">Write a Review</div>
                  </div>
                  <div className="details_sub cats">
                    <ul>
                      {product?.brand && (
                        <li>
                          <b>Brand :</b> {product?.brand?.name}
                        </li>
                      )}
                      {product?.category && (
                        <li>
                          <b>Category :</b>{" "}
                          {product?.category
                            ?.map((item) => item?.name)
                            .join(", ")}
                        </li>
                      )}
                      {product?.tags && (
                        <li>
                          <b>Tags :</b>{" "}
                          {product?.tags?.map((item) => item?.name).join(", ")}
                        </li>
                      )}
                      <li>
                        <b>Availablity :</b>{" "}
                        {product?.stock_status === true
                          ? "In Stock"
                          : "Out of Stock"}
                      </li>
                    </ul>
                  </div>
                  <div className="details_sub payments">
                    <div className="quantity">
                      <button onClick={decrementQuantity}>-</button>
                      <input type="text" value={quantity} />
                      <button onClick={incrementQuantity}>+</button>
                    </div>
                    {cart_list?.product?.find(
                      (item) => item?.product_id?._id === product?._id
                    ) ? (
                      <div className="add_to_cart_align">
                        <Link to="/cart">
                          <Button className="add_to_cart">Go To Cart</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="add_to_cart_align">
                        <Button
                          className="add_to_cart"
                          onClick={() => addtoCart()}
                          loading={loading.add}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          className="buy_it_now"
                          onClick={() => buyNow()}
                          loading={loading.buy}
                        >
                          Buy It Now
                        </Button>
                      </div>
                    )}
                  </div>
                  {product?.specification?.length > 0 && (
                    <div className="details_sub specification">
                      <h4>Specification</h4>
                      <table className="s_table">
                        <tbody>
                          {product?.specification?.map((item) => {
                            return (
                              <tr key={item?.id}>
                                <td>{item?.name}</td>
                                <td>{item?.description}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="details_sub">
                    {wishlist?.find((item) => item?._id === product?._id) ? (
                      <div className="wishlist_product">
                        <img src={wishtrue} alt="wish" className="no_filter" />{" "}
                        Wishlist
                      </div>
                    ) : (
                      <div
                        className="wishlist_product"
                        onClick={() => addWish(product?._id)}
                      >
                        <img src={wish} alt="wish" /> Add to Wishlist
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="product_review_section">
              <h2>Review</h2>
              <div className="review_align">
                <div className="review_left">
                  <List
                    itemLayout="horizontal"
                    header={`${
                      review_lsit.length > 0 ? review_lsit.length : "0"
                    } replies`}
                    dataSource={review_lsit}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={dummy_profile} />}
                          title={
                            <div className="review_name">
                              <h4>{item?.buyer_id?.name}</h4>
                              {" - "}
                              <i>
                                {moment
                                  .utc(item.createdAt)
                                  .local()
                                  .startOf("seconds")
                                  .fromNow()}
                              </i>
                              <br />
                              <Rate
                                allowHalf
                                defaultValue={item?.rating}
                                className="review_rate"
                                disabled
                              />
                            </div>
                          }
                          description={item?.message}
                        />
                      </List.Item>
                    )}
                  />
                </div>
                <div className="review_right">
                  <Form onFinish={(e) => addReview(e)} form={reviewForm}>
                    <Form.Item
                      label="Your rating"
                      name="rating"
                      rules={[
                        {
                          required: true,
                          message: "Please input your rating!",
                        },
                      ]}
                    >
                      <Rate defaultValue={0} />
                    </Form.Item>
                    <Form.Item
                      label="Review"
                      name="message"
                      rules={[
                        {
                          required: true,
                          message: "Please input your review!",
                        },
                      ]}
                    >
                      <Input.TextArea rows={4} maxLength={100} />
                    </Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading.reviewadd}
                    >
                      Submit Review
                    </Button>
                  </Form>
                </div>
              </div>
            </div>

            <div className="product_relater_section">
              <h2>Related Products</h2>
              <div className="relater_product_align">
                <div className="col_4 g_25 col_3_xl col_2_lg col_1_sm">
                  {rerlated?.slice(0, 4).map((e) => {
                    const wish_yes = wishlist?.find((w) => w?._id === e?._id);
                    const cat = e?.category?.filter(
                      (item) =>
                        cats?.includes(item?._id) && e?._id !== product?._id
                    );
                    if (cat.length > 0) {
                      return (
                        <div className="product_box" key={e?._id}>
                          <Link
                            to={"/product/" + e?.slug}
                            title={e?.product_name}
                          >
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
                          {wish_yes !== undefined ? (
                            <div className="wishlist">
                              <img
                                src={wishtrue}
                                alt="wishlist"
                                className="no_filter"
                              />
                            </div>
                          ) : (
                            <div
                              className="wishlist"
                              onClick={() => addWish(e?._id)}
                            >
                              <img src={wish} alt="wishlist" />
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
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
};

export default Products;
