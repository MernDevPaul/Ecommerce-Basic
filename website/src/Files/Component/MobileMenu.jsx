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
import { useSelector, useDispatch } from "react-redux";
import API from "../Api/ApiService";
import { Link } from "react-router-dom";
import {
  commonStart,
  commonSuccess,
  commonFailure,
} from "../Store/Slice/CommonSlice";
const MobileMenu = () => {
  const api = new API();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState([]);
  const menu_list = useSelector((state) => state?.common?.menuslist?.data);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
   const initFunction = async () => {
     await api.getAll(
       dispatch,
       [commonStart, commonSuccess, commonFailure, "search", {}],
       "productlist",
       {},
       (err, res) => {}
     );
   };
   useEffect(() => {
     initFunction();
     menuFunction(null, menu_list);
   }, [menu_list]);
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
