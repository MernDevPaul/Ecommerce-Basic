import React from 'react'
import Country from '../Component/Settings/Country';
import State from "../Component/Settings/State";
import Home from "../Component/Dashboard/Home";
import City from "../Component/Settings/City";
import Company from '../Component/Settings/Company';
import Users from '../Component/Settings/Users';
import Staff from '../Component/Settings/Staff';
import Tax from "../Component/Products/Tax";
import Tags from "../Component/Products/Tags";
import Category from "../Component/Products/Category";
import Brands from './../Component/Products/Brands';
import Banners from "./../Component/Cms/Banners";
import Products from "./../Component/Products/Products";
import BlogCategory from './../Component/Blog/BlogCategory';
import BlogTags from '../Component/Blog/BlogTags';
import Blog from "../Component/Blog/Blog";
import Pages from '../Component/Cms/Pages';
import WebMenus from '../Component/Cms/WebMenus';
import Includes from '../Component/Cms/Includes';
import Order from '../Component/Porcess/Order';
import Enquiry from '../Component/Porcess/Enquiry';
import NoPage from '../Component/Dashboard/NoPage';
import SocialMedia from '../Component/Settings/SocialMedia';

const authRoute = [
  {
    index: true,
    exact: true,
    path: "/",
    element: <Home title="Dashboard" />,
  },
  {
    exact: true,
    path: "/country",
    element: <Country title="Country" />,
  },
  {
    exact: true,
    path: "/state",
    element: <State title="State" />,
  },
  {
    exact: true,
    path: "/city",
    element: <City title="City" />,
  },
  {
    exact: true,
    path: "/company",
    element: <Company title="Company" />,
  },
  {
    exact: true,
    path: "/users",
    element: <Users title="Users" />,
  },
  {
    exact: true,
    path: "/staff",
    element: <Staff title="Staff" />,
  },
  {
    exact: true,
    path: "/tax",
    element: <Tax title="Tax" />,
  },
  {
    exact: true,
    path: "/tags",
    element: <Tags title="Tags" />,
  },
  {
    exact: true,
    path: "/brands",
    element: <Brands title="Brands" />,
  },
  {
    exact: true,
    path: "/category",
    element: <Category title="Category" />,
  },
  {
    exact: true,
    path: "/banners",
    element: <Banners title="Banners" />,
  },
  {
    exact: true,
    path: "/products",
    element: <Products title="Products" />,
  },
  {
    exact: true,
    path: "/blogcategory",
    element: <BlogCategory title="Blog Category" />,
  },
  {
    exact: true,
    path: "/blogtags",
    element: <BlogTags title="Blog Tags" />,
  },
  {
    exact: true,
    path: "/blog",
    element: <Blog title="Blogs" />,
  },
  {
    exact: true,
    path: "/pages",
    element: <Pages title="Pages" />,
  },
  {
    exact: true,
    path: "/webmenus",
    element: <WebMenus title="Web Menus" />,
  },
  {
    exact: true,
    path: "/includes",
    element: <Includes title="Header & Footer" />,
  },
  {
    exact: true,
    path: "/orders",
    element: <Order title="Orders" />,
  },
  {
    exact: true,
    path: "/enquiry",
    element: <Enquiry title="Enquiry" />,
  },
  {
    exact: true,
    path: "/social-media",
    element: <SocialMedia title="Social Media" />,
  },
  {
    path: "*",
    element: <NoPage title="Sorry, the page you visited does not exist." />,
  },
];






export { authRoute };