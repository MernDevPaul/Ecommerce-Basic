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
} from "@ant-design/icons";
import { Layout, Menu, Input, Dropdown, Avatar } from "antd";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import Logo from "../../Assets/Images/logo.png";
const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
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
    getItem("Settings", "2", <SettingOutlined />, [
      getItem(<Link to="/country">Country</Link>, "2a"),
      getItem(<Link to="/state">State</Link>, "2b"),
      getItem(<Link to="/city">City</Link>, "2c"),
      getItem(<Link to="/company">Company</Link>, "2d"),
      getItem(<Link to="/social-media">Social Media</Link>, "2da"),
      getItem(<Link to="/users">Users</Link>, "2e"),
      getItem(<Link to="/staff">Staff</Link>, "2f"),
    ]),
    getItem("Blogs", "3", <PushpinOutlined />, [
      getItem(<Link to="/blog">All Blogs</Link>, "3a"),
      getItem(<Link to="/blogcategory">Category</Link>, "3b"),
      getItem(<Link to="/blogtags">Tags</Link>, "3c"),
    ]),
    getItem("CMS", "4", <ReadOutlined />, [
      getItem(<Link to="/banners">Banners</Link>, "4a"),
      getItem(<Link to="/pages">Pages</Link>, "4a1"),
      getItem(<Link to="/webmenus">Web Menus</Link>, "4b"),
      getItem(<Link to="/includes">Header & Footer</Link>, "4c"),
    ]),
    getItem("Products", "5", <ShoppingOutlined />, [
      getItem(<Link to="/products">Products</Link>, "5a"),
      getItem(<Link to="/brands">Brands</Link>, "5c"),
      getItem(<Link to="/category">Category</Link>, "5d"),
      getItem(<Link to="/tags">Tags</Link>, "5b"),
      getItem(<Link to="/tax">Tax</Link>, "5f"),
    ]),
    getItem("Process", "6", <HistoryOutlined />, [
      getItem(<Link to="/orders">Orders</Link>, "6a"),
      getItem(<Link to="/enquiry">Enquiry</Link>, "6b"),
    ]),
    getItem(
      <div onClick={() => logout()}>Logout</div>,
      "8",
      <PoweroffOutlined />
    ),
  ];
  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("is_admin");
    window.location.reload(true);
  };
  const items = [
    {
      label: "My Profile",
      key: "0",
      icon: <UserOutlined />,
    },
    {
      label: "Change Password",
      key: "1",
      icon: <SafetyCertificateOutlined />,
    },
    {
      label: <div onClick={logout}>Logout</div>,
      key: "3",
      icon: <PoweroffOutlined />,
    },
  ];

  return (
    <>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          className="desktop_menu"
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="light"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={menu}
          />
        </Sider>
        <Layout>
          <Header className="header_section">
            <div className="header_align">
              <div className="header_left">
                <div className="header_left_menu">
                  <MobileMenu />
                </div>
                <Link to="/" title="Home">
                  <img src={Logo} alt="Logo" />
                </Link>
              </div>
              <div className="header_right">
                <div className="search_head">
                  <Search
                    placeholder="search anything"
                    className="width_300px"
                  />
                </div>
                <div className="menu_list">
                  <div className="items_badges">
                    <BellOutlined />
                    <span className="badge_count blue">5</span>
                  </div>
                  <div className="items_badges">
                    <MailOutlined />
                    <span className="badge_count red">5</span>
                  </div>
                  <div className="my_details">
                    <Dropdown
                      menu={{
                        items,
                      }}
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Avatar size={30} icon={<UserOutlined />} />{" "}
                        <MoreOutlined />
                      </a>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          </Header>
          <Content className="p_25 dynamic_content">
            <Outlet />
          </Content>
          <Footer>©2023 Develop by Paul</Footer>
        </Layout>
      </Layout>
    </>
  );
};
export default Dashboard;
