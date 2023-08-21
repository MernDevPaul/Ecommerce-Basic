import React, { useState, useEffect } from "react";
import {
  DesktopOutlined,
  SettingOutlined,
  UserOutlined,
  PushpinOutlined,
  ReadOutlined,
  BellOutlined,
  MailOutlined,
  PoweroffOutlined,
  MoreOutlined,
  SafetyCertificateOutlined,
  ShoppingOutlined,
  GiftOutlined,
  HistoryOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Menu, Drawer, Button, Spin } from "antd";
import { Link } from "react-router-dom";



const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
   const getItem = (label, key, icon, children) => {
     return {
       key,
       icon,
       children,
       label,
     };
   };
  const menu = [
    getItem(<Link to="/">DashBoard</Link>, "1", <DesktopOutlined />),
    getItem("Pre-Requisites", "2", <SettingOutlined />, [
      getItem(<Link to="/country">Country</Link>, "2a"),
      getItem("State", "2b"),
      getItem("City", "2c"),
      getItem("Company", "2d"),
      getItem("Users", "2e"),
      getItem("Staff", "2f"),
    ]),
    getItem("Blogs", "3", <PushpinOutlined />, [
      getItem("All Blogs", "3a"),
      getItem("Category", "3b"),
      getItem("Tags", "3c"),
    ]),
    getItem("CMS", "4", <ReadOutlined />, [
      getItem("Pages", "4a"),
      getItem("Menus", "4b"),
      getItem("Header & Footer", "4c"),
    ]),
    getItem("Products", "5", <ShoppingOutlined />, [
      getItem("Products", "5a"),
      getItem("Specification", "5b"),
      getItem("Brand", "5c"),
      getItem("Category", "5d"),
      getItem("Tax", "5f"),
      getItem("Delivery Charge", "5g"),
    ]),
    getItem("Process", "6", <HistoryOutlined />, [
      getItem("Orders", "6a"),
      getItem("Enquiry", "6b"),
      getItem("Reports", "6c"),
    ]),
    getItem("Offers", "7", <GiftOutlined />, [
      getItem("Discounts", "7a"),
      getItem("Offers", "7b"),
      getItem("Coupons", "7c"),
      getItem("Buyer Category", "7d"),
    ]),
    getItem("Logout", "8", <PoweroffOutlined />),
  ];

  return (
    <>
      <div className="mobile_menu">
        <div onClick={showDrawer} className="menu_icon">
          <AppstoreOutlined />
        </div>
        <Drawer
          title="Menubar"
          placement="left"
          onClose={onClose}
          open={open}
          style={{ padding: 0 }}
          width={260}
        >
          {loading === true ? (
            <div className="spin_center">
              <Spin />
            </div>
          ) : (
            <Menu
              theme="light"
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={menu}
            />
          )}
        </Drawer>
      </div>
    </>
  );
};

export default MobileMenu;


