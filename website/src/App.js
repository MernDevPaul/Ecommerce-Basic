import React, { useEffect, useLayoutEffect } from "react";
import "./Files/Assets/Css/Common.css";
import "./Files/Assets/Css/Style.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Files/Component/Home";
import Header from "./Files/Component/Header";
import Footer from "./Files/Component/Footer";
import Shop from "./Files/Component/Shop";
import Products from "./Files/Component/Products";
import API from "./Files/Api/ApiService";
import { useDispatch } from "react-redux";
import {
  commonStart,
  commonSuccess,
  commonFailure,
} from "./Files/Store/Slice/CommonSlice";
import {
  accountStart,
  accountSuccess,
  accountFailure,
} from "./Files/Store/Slice/MyAccountSlice";
import Login from "./Files/Component/Login";
import Register from "./Files/Component/Register";
import ForgotPassword from "./Files/Component/ForgotPassword";
import Cart from "./Files/Component/Cart";
import Checkout from "./Files/Component/Checkout";
import Wishlist from "./Files/Component/Wishlist";
import AccountLayout from "./Files/Component/AccountLayout";
import MyProfile from "./Files/Component/MyProfile";
import MyAddress from "./Files/Component/MyAddress";
import MyOrder from "./Files/Component/MyOrder";
import MyOrderDetails from "./Files/Component/MyOrderDetails";
import Enquiry from "./Files/Component/Enquiry";
import Pages from "./Files/Component/Pages";
import BlogDetails from "./Files/Component/BlogDetails";
import ProtectedRoute from "./Files/Api/ProtectedRoute";
const App = () => {
  const Wrapper = ({ children }) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(500, 0);
    }, [location.pathname]);
    return children;
  };
  const api = new API();
  const dispatch = useDispatch();
  //initFunction
  const initFunction = async () => {
    await Promise.all([
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "brandlist"],
        "mastersettings",
        { type: "brands", status: true },
        (err, res) => {}
      ),
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "categorylist"],
        "mastersettings",
        { type: "category", status: true },
        (err, res) => {}
      ),
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "bannerlist"],
        "banner",
        { status: true },
        (err, res) => {}
      ),
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "menuslist"],
        "webmenus",
        { status: true },
        (err, res) => {}
      ),
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "companylist"],
        "company",
        {},
        (err, res) => {}
      ),
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "bloglist"],
        "blog",
        {},
        (err, res) => {}
      ),
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "featureproductlist"],
        "productlist",
        { status: true, featured_product: true },
        (err, res) => {}
      ),
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "popularlist"],
        "productlist",
        { status: true, popular_product: true },
        (err, res) => {}
      ),
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "hotsalelist"],
        "productlist",
        { status: true, hot_sale: true },
        (err, res) => {}
      ),
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "tagslist"],
        "mastersettings",
        { type: "tags", status: true },
        (err, res) => {}
      ),
      await api.getAll(
        dispatch,
        [commonStart, commonSuccess, commonFailure, "social"],
        "social",
        {},
        (err, res) => {}
      )
    ]);
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

  //init
  useEffect(() => {
    initFunction();
  }, []);
  return (
    <>
      <BrowserRouter>
        <Wrapper>
          <Header />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/category/:name" element={<Shop />} />
            <Route path="/brand/:name" element={<Shop />} />
            <Route path="/tags/:name" element={<Shop />} />
            <Route path="/product/:name" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<MyProfile />} />
              <Route path="delivery-address" element={<MyAddress />} />
              <Route path="my-order" element={<MyOrder />} />
              <Route path="my-orderdetails/:id" element={<MyOrderDetails />} />
            </Route>
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/page/:slug" element={<Pages />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
          </Routes>
          <Footer />
        </Wrapper>
      </BrowserRouter>
    </>
  );
};

export default App;
