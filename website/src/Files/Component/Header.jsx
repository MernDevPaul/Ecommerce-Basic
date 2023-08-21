import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Assets/Images/logo.png";
import Order from "../Assets/Images/order.png";
import Wishlist from "../Assets/Images/wishlist.png";
import User from "../Assets/Images/users.png";
import Cart from "../Assets/Images/cart.png";
import Fb from "../Assets/Images/fb.webp";
import Insta from "../Assets/Images/insta.webp";
import social from '../Assets/Images/category.png'
import myacc from "../Assets/Images/myaccount.png";
import { Input, Menu, Badge, Dropdown, AutoComplete } from "antd";
import { useSelector,useDispatch } from "react-redux";
import API from "../Api/ApiService";
import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  commonStart,
  commonSuccess,
  commonFailure,
} from "../Store/Slice/CommonSlice";
import pro from "../Assets/Images/pro.png";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [menu, setMenu] = useState([]);
  const api = new API();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menu_list = useSelector((state) => state?.common?.menuslist?.data);
  const cart_list = useSelector((state) => state?.account?.cartlist?.data);
  const all_product = useSelector((state) => state?.common?.search?.data);
  const social = useSelector((state) => state?.common?.social?.data);
  const company_list = useSelector((state) => state?.common?.companylist?.data);
  const menuFunction = (parent, menu) => {
    const filter = menu?.filter((e) => {
      return String(e.parent) === String(parent);
    });
    const final = filter?.map((e) => {
      return {
        key: e?._id,
        label: <Link to={e.url === "" ? void 0 : e.url}>{e.name}</Link>,
        children:
          menuFunction(e._id, menu).length > 0 ? menuFunction(e._id, menu) : "",
      };
    });
    setMenu(final);
    return final;
  };
  const initFunction = async () => {
    await api.getAll(
      dispatch,
      [commonStart, commonSuccess, commonFailure, "search", {}],
      "productlist",
      {},
      (err, res) => {}
    );
  }
  useEffect(() => {
    initFunction();
    menuFunction(null, menu_list);
  }, [menu_list]);

  const logout = () => {
    localStorage.removeItem("web_token");
    localStorage.removeItem("is_buyer");
    window.location.href = "/";
  }

  const items = [
    {
      label: (
        <Link to={"/account/delivery-address"}>
          <HomeOutlined /> Delivery Address
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Link to={"/account/profile"}>
          <UserOutlined />
          Profile
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <Link to={"/account/my-order"}>
          <ShoppingCartOutlined /> Order
        </Link>
      ),
      key: "3",
    },
    {
      type: "divider",
    },
    {
      label: (
        <a onClick={logout} >
          <LogoutOutlined />
          Logout
        </a>
      ),
      key: "4",
    },
  ];


   const searchResult = (query) => {
     return all_product
       ?.filter((e) => e?.slug.includes(query))
       .map((e, i) => ({
         value: e?.slug,
         label: (
           <div className="search_inside">
             <div className="s_image">
               <img
                 src={e.image[0] ? api.apiUrl + e?.image[0]?.image_path : pro}
                 alt={e?.product_name}
               />
             </div>
             <div className="s_name">{e.product_name}</div>
           </div>
         ),
       }));
   };
  const [options, setOptions] = useState([]);
  const handleSearch = (value) => {
    setOptions(value ? searchResult(value) : []);
  };
  const onSelect = (value) => {
    navigate("/product/" + value);
  };


  return (
    <>
      <div className="w_100_p d_i_b bg_dark">
        <div className="header_top">
          <div className="wrapper">
            <div className="d_f a_i_c j_c_s_b f_w_w p_t_10 p_b_10">
              <div className="p_tag">
                For Bulk Order {company_list?.landline}
              </div>
              <div className="p_tag">
                {company_list?.phone && `Hotline: +91 ${company_list?.phone}`}
              </div>
            </div>
          </div>
        </div>
        <div className="header_bottom w_100_p d_i_b p_t_20 p_b_20">
          <div className="wrapper">
            <div className="d_f a_i_c j_c_s_b f_w_w header_bottom_section">
              <div className="header_bottom_1">
                <div className="mobile_menu">
                  <MobileMenu />
                </div>
                <Link to="/">
                  <img
                    src={
                      company_list?.logo
                        ? api.apiUrl + company_list?.logo
                        : Logo
                    }
                    alt="Logo"
                  />
                </Link>
              </div>
              <div className="header_bottom_2">
                <AutoComplete
                  options={options}
                  onSelect={onSelect}
                  onSearch={handleSearch}
                  style={{ width: 450 }}
                >
                  <Input.Search
                    placeholder="Search Product Here.."
                    enterButton
                  />
                </AutoComplete>
              </div>
              <div className="header_bottom_3">
                <ul className="d_f g_35">
                  <Link to={"/account/my-order"}>
                    <li>
                      <div>
                        <img src={Order} alt="my order" />
                      </div>
                      <div>My Order</div>
                    </li>
                  </Link>
                  <Link to="/wishlist">
                    <li>
                      <div>
                        <img src={Wishlist} alt="wishlist" />
                      </div>
                      <div>Wishlist</div>
                    </li>
                  </Link>
                  {api.webtoken !== "" && Boolean(api.isbuyer) === true ? (
                    <Dropdown
                      menu={{
                        items,
                      }}
                      className="a_drop_menu"
                    >
                      <a
                        onClick={(e) => e.preventDefault()}
                        style={{ cursor: "pointer" }}
                      >
                        <li>
                          <div>
                            <img src={myacc} alt="login" />
                          </div>
                          <div>My Account</div>
                        </li>
                      </a>
                    </Dropdown>
                  ) : (
                    <Link to="/login">
                      <li>
                        <div>
                          <img src={User} alt="login" />
                        </div>
                        <div>Sign Up / Login</div>
                      </li>
                    </Link>
                  )}
                  <Link to={"/cart"}>
                    <li>
                      <div>
                        <Badge
                          count={cart_list?.product?.length || 0}
                          showZero
                          size="small"
                          className="cart_count"
                        >
                          <img src={Cart} alt="cart" />
                        </Badge>
                      </div>
                      <div>Cart</div>
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w_100_p d_i_b bg header_menu">
        <div className="wrapper">
          <div className="d_f a_i_c j_c_s_b f_w_w">
            <div className="w_80_p d_i_b">
              <Menu mode="horizontal" items={menu} />
            </div>
            <div className="w_15_p d_i_b">
              <ul className="w_f_c d_f g_20 social_media">
                {social?.map((e, i) => {
                  return (
                    <li key={i}>
                      <div>
                        <Link
                          to={e?.url ? e?.url : void 0}
                          title={e?.name}
                          target="_blank"
                        >
                          <img
                            src={
                              e?.image
                                ? `http://localhost:9000/${e?.image}`
                                : social
                            }
                            alt="fb"
                          />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
