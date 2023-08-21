import React from 'react'
import {Breadcrumb} from 'antd'
import { Outlet, Link } from "react-router-dom";
const AccountLayout = () => {
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
                title: "My Account",
              },
            ]}
          />
        </div>
      </div>
      <div className="my_account_layout">
        <div className="wrapper">
          <div className="my_account_layout_align">
            <h1>My Account</h1>
            <div className="my_account_align">
              <div className="my_account_left">
                <ul>
                  <Link to={"/account/delivery-address"}>
                    <li>Delivery Address</li>
                  </Link>
                  <Link to={'/account/profile'}>
                    <li>My Profile</li>
                  </Link>
                  <Link to={'/account/my-order'}>
                    <li>My Order</li>
                  </Link>
                </ul>
              </div>
              <div className="my_account_right">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountLayout