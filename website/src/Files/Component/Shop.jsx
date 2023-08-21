import React, { useState ,useEffect} from "react";
import {
  Breadcrumb,
  Menu,
  Checkbox,
  Radio,
  Slider,
  Rate,
  Select,
  Pagination,
  Empty,
  message,
} from "antd";
import { useSelector,useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import pro from "../Assets/Images/pro.png";
import wish from "../Assets/Images/wishlist.png";
import g1 from '../Assets/Images/gr.svg'
import g2 from '../Assets/Images/gr2.svg'
import g3 from '../Assets/Images/gr3.svg'
import g4 from "../Assets/Images/gr4.svg";
import wishtrue from "../Assets/Images/wish_true.png";
import API from "../Api/ApiService";
import Helper from "../Api/Helper";
import { commonStart, commonSuccess, commonFailure } from "../Store/Slice/CommonSlice";
import {accountStart, accountSuccess, accountFailure} from "../Store/Slice/MyAccountSlice";
import { useParams } from "react-router-dom";
const Shop = () => {
  const [menu,setMenu] = useState([]);
  const [brand, setBrand] = useState([]);
  const [rangeMin,setRangeMin] = useState(0);
  const [rangeMax, setRangeMax] = useState(0);
   const [prevValues, setPrevValues] = useState({});
  const menu_list = useSelector((state) => state?.common?.categorylist?.data);
  const brand_list = useSelector((state) => state?.common?.brandlist?.data);
  const tags_list = useSelector((state) => state?.common?.tagslist?.data);
  const filter_list = useSelector(
    (state) => state?.common?.filterproductslist?.data[0]?.products
  );
  const price_range = useSelector(
    (state) => state?.common?.filterproductslist?.data[0]?.pricerange
  );
  const total = useSelector(
    (state) =>
      state?.common?.filterproductslist?.data[0]?.total
  );
  const wishlist = useSelector(
    (state) => state?.account?.wishlist?.data?.wishlist
  );
  const shuffledCategories = Helper.randomItem(filter_list).slice(0, 2);
  let excludes = "company_code,product_description,product_short_description,sku,tags,brand,discount,meta_title,display_date,tax,specification,created_at,__v,category";
  const api = new API();
  const dispatch = useDispatch();
  const location = window.location.pathname.split("/");
  const params = useParams();
  const menuFunction = (parent, menu) => {
    const filter = menu?.filter((e) => {
      return String(e.parent_id) === String(parent);
    });
    const final = filter?.map((e) => {
      return {
        key: e?._id,
        label: (
          <Link
            to={e?.slug === "" ? void 0 : "/category/" + e?.slug}
            title={e?.name}
          >
            {e.name}
          </Link>
        ),
        children:
          menuFunction(e._id, menu).length > 0 ? menuFunction(e._id, menu) : "",
      };
    });
    setMenu(final);
    return final;
  };  
  const brandFunction = (parent, menu) => {
    const filter = menu?.filter((e) => {
      return String(e.parent_id) === String(parent);
    });
    const final = filter?.map((e) => {
      return {
        key: e?._id,
        label: (
          <Link
            to={e?.slug === "" ? void 0 : "/brand/" + e?.slug}
            title={e?.name}
          >
            {e.name}
          </Link>
        ),
        children:
          brandFunction(e._id, menu).length > 0
            ? brandFunction(e._id, menu)
            : "",
      };
    });
    setBrand(final);
    return final;
  };
  
  //init Render 
  const initRender = async () => {
    
    if (price_range) {
      setRangeMin(price_range[0]?.minPrice);
      setRangeMax(price_range[0]?.maxPrice);
    }
    let options = {};
    if (location[1] === "category") {
      if (location[2] === "all") {

      } else {
        options.categoryname = location[2];
      }
    }
    if (location[1] === "brand") {
      options.brandname = location[2];
    }
    if (location[1] === "tags") {
      options.tagsname = location[2];
    }
    options.page = 1;
    options.limit = 8;
      api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "filterproductslist"],
        "productlist/filter",
        { ...options, status: true, excludes: excludes },
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
  }
  //init function
  useEffect(() => {
    initRender();
    menuFunction(null, menu_list);
    brandFunction(null, brand_list);
  }, [menu_list, brand_list, params]);
  const onChange = async (e, type) => {
    const filter = { ...prevValues };
    if (type === "page") {
      delete filter.page;
      delete filter.limit;
      filter.page = e;
      filter.limit = 8;
    } else {
      delete filter.page;
      delete filter.limit;
      filter.page = 1;
      filter.limit = 8;
    }
    if (type === "sortby") {
      delete filter.lowtohigh;
      delete filter.hightolow;
      delete filter.newtoold;
      delete filter.oldtonew;
    }
    if (type === "stock") {
      delete filter.outofstock;
      delete filter.instock;
    }
    if (location[1] === "category") {
      if (location[2] === "all") {
        delete filter.tagsname;
        delete filter.categoryname;
        delete filter.brandname;
      } else {
        delete filter.tagsname;
        delete filter.categoryname;
        delete filter.brandname;
        filter.categoryname = location[2];
      }
    }
    if (location[1] === "brand") {
      delete filter.tagsname;
      delete filter.categoryname;
      delete filter.brandname;
      filter.brandname = location[2];
    }
    if (location[1] === "tags") {
      delete filter.tagsname;
      delete filter.categoryname;
      delete filter.brandname;
      filter.tagsname = location[2];
    }
    if (type === "price") {
      filter.min = e[0];
      filter.max = e[1];
    }
    if (type === "stock") {
      if (e === true) {
        filter.instock = true;
      } else if (e === false) {
        filter.outofstock = false;
      } else {
        delete filter.instock;
        delete filter.outofstock;
      }
    }
    if (type === "sortby") {
      filter[e] = true;
    }
    setPrevValues(filter);
    api.getAll(
      dispatch,
      [commonStart, commonSuccess, commonFailure, "filterproductslist"],
      "productlist/filter",
      { ...filter, status: true, excludes: excludes },
      (err, res) => {}
    );
  }
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
          initRender();
        } else {
          message.error(err.response.data.message);
        }
      }
    );
  } else {
    message.warning("Please Login");
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
                title: "Our Store",
              },
            ]}
          />
        </div>
      </div>
      <div className="section shop_section">
        <div className="wrapper">
          <div className="shop_align">
            <div className="shop_left">
              <div className="category_filter box_bg_white">
                <h4 className="shop_title">Shop By Category</h4>
                <Menu mode="inline" items={menu} />
              </div>

              <div className="category_filter box_bg_white">
                <h4 className="shop_title">Shop By Brand</h4>
                <Menu mode="inline" items={brand} />
              </div>

              <div className="filter_by box_bg_white">
                <h4 className="shop_title">Filter By</h4>
                <div className="sub_filter">
                  <h5>Availablity</h5>
                  <div className="check_group">
                    <Radio.Group
                      onChange={(e) => onChange(e.target.value, "stock")}
                      className="col_1 g_10"
                    >
                      <Radio value={null}>All</Radio>
                      <Radio value={true}>In Stock</Radio>
                      <Radio value={false}>Out of Stock</Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div className="sub_filter">
                  <h5>Price</h5>
                  <Slider
                    range
                    onChange={(e) => onChange(e, "price")}
                    defaultValue={[0, Infinity]}
                    min={rangeMin}
                    max={rangeMax}
                  />
                </div>
                {/* <div className="sub_filter">
                  <h5>Rating</h5>
                  <div className="check_group">
                    <Checkbox onChange={() => onChange(1, "rating")}>
                      1 Star
                    </Checkbox>
                    <Checkbox onChange={() => onChange(2, "rating")}>
                      2 Star
                    </Checkbox>
                    <Checkbox onChange={() => onChange(3, "rating")}>
                      3 Star
                    </Checkbox>
                    <Checkbox onChange={() => onChange(4, "rating")}>
                      4 Star
                    </Checkbox>
                    <Checkbox onChange={() => onChange(5, "rating")}>
                      5 Star
                    </Checkbox>
                  </div>
                </div> */}
              </div>

              <div className="product_tags box_bg_white">
                <h4 className="shop_title">Product Tags</h4>
                <ul>
                  {tags_list?.map((e) => {
                    return (
                      <li key={e?._id}>
                        <Link
                          to={e?.slug === "" ? void 0 : "/tags/" + e?.slug}
                          title={e?.name}
                        >
                          {e.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="random_products box_bg_white">
                <h4 className="shop_title">Random Products</h4>
                <div className="random_products_align">
                  {shuffledCategories?.map((e) => {
                    return (
                      <div className="random_product_box">
                        <Link
                          to={"/product/" + e?.slug}
                          title={e?.product_name}
                        >
                          <div className="random_product_box">
                            <div className="random_product_left">
                              <img
                                src={
                                  e.image[0]
                                    ? api.apiUrl + e?.image[0]?.image_path
                                    : pro
                                }
                                alt={e?.product_name}
                              />
                            </div>
                            <div className="random_product_right">
                              <p>{e?.product_name}</p>
                              <Rate allowHalf defaultValue={2.5} disabled />
                              <div className="price">
                                {e?.sp && (
                                  <div className="sp">
                                    {api?.currency + " " + e?.sp}
                                  </div>
                                )}
                                {e?.mrp && (
                                  <div className="mrp">
                                    {api?.currency + " " + e?.mrp}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="shop_right">
              <div className="filter_tab">
                <div className="filter_tab_align">
                  <div className="filter_tab_left">
                    Sort by:{" "}
                    <Select
                      className="w_150_px"
                      showSearch
                      placeholder="Sort by"
                      optionFilterProp="children"
                      onChange={(e) => onChange(e, "sortby")}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        {
                          label: "Low to High",
                          value: "lowtohigh",
                        },
                        {
                          label: "High to Low",
                          value: "hightolow",
                        },
                        {
                          label: "New to Old",
                          value: "newtoold",
                        },
                        {
                          label: "Old to New",
                          value: "oldtonew",
                        },
                      ]}
                    />
                  </div>
                  <div className="filter_tab_right">
                    <span>
                      Result by {total} Product
                      {total === 1 || total === 0 ? "" : "s"}
                    </span>
                    {/* <ul>
                      <li>
                        <img src={g1} alt="grid" />
                      </li>
                      <li>
                        <img src={g2} alt="grid" />
                      </li>
                      <li>
                        <img src={g3} alt="grid" />
                      </li>
                      <li>
                        <img src={g4} alt="grid" />
                      </li>
                    </ul> */}
                  </div>
                </div>
              </div>
              {total > 0 ? (
                <>
                  <div className="col_4 g_20 list_all_products col_3_xl col_2_md col_1_sm">
                    {filter_list?.map((e) => {
                      const wish_yes = wishlist?.find((w) => w?._id === e?._id);
                      return (
                        <div className="product_box">
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
                            <h5>{e?.categoryDocs[0]?.name}</h5>
                            <p>{e?.product_name}</p>
                            <div className="rating">
                              <Rate allowHalf defaultValue={4.5} disabled />
                            </div>
                            <div className="price">
                              {e?.sp && (
                                <div className="sp">
                                  {api?.currency + " " + e?.sp}
                                </div>
                              )}
                              {e?.mrp && (
                                <div className="mrp">
                                  {api?.currency + " " + e?.mrp}
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
                    })}
                  </div>
                  {total > 0 && (
                    <div className="col_1 m_t_40">
                      <Pagination
                        defaultCurrent={1}
                        total={total}
                        pageSize={8}
                        onChange={(e) => onChange(e, "page")}
                        size="small"
                        className="page_class"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="col_1 m_t_50">
                  <Empty />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop