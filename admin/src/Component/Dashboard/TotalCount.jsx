import React from 'react'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingOutlined,
  WalletOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Link } from 'react-router-dom';


const TotalCount = () => {
  return (
    <>
      <div className="col_4 g_25 col_2_xxl col_1_sm">
        <div className="col_1 bg_box p_15">
          <div className="box_total_count d_f a_i_f_s j_c_s_b">
            <h4 className="h_4_gray">Users</h4>
            <div className="c_green">
              <ArrowUpOutlined /> 20%
            </div>
          </div>
          <h2 className="m_t_25 m_b_10 h_2">Rs 100</h2>
          <div className="box_total_count d_f a_i_f_e j_c_s_b">
            <Link className="link" to={void 0}>
              See All Users
            </Link>
            <div className="box_pr box_pr1">
              <UserOutlined />
            </div>
          </div>
        </div>

        <div className="col_1 bg_box p_15">
          <div className="box_total_count d_f a_i_f_s j_c_s_b">
            <h4 className="h_4_gray">Orders</h4>
            <div className="c_green">
              <ArrowUpOutlined /> 20%
            </div>
          </div>
          <h2 className="m_t_25 m_b_10 h_2">Rs 100</h2>
          <div className="box_total_count d_f a_i_f_e j_c_s_b">
            <Link className="link" to={void 0}>
              See All Users
            </Link>
            <div className="box_pr box_pr2">
              <ShoppingOutlined />
            </div>
          </div>
        </div>

        <div className="col_1 bg_box p_15">
          <div className="box_total_count d_f a_i_f_s j_c_s_b">
            <h4 className="h_4_gray">Earnings</h4>
            <div className="c_green">
              <ArrowUpOutlined /> 20%
            </div>
          </div>
          <h2 className="m_t_25 m_b_10 h_2">Rs 100</h2>
          <div className="box_total_count d_f a_i_f_e j_c_s_b">
            <Link className="link" to={void 0}>
              See All Users
            </Link>
            <div className="box_pr box_pr3">
              <LineChartOutlined />
            </div>
          </div>
        </div>

        <div className="col_1 bg_box p_15">
          <div className="box_total_count d_f a_i_f_s j_c_s_b">
            <h4 className="h_4_gray">Blance</h4>
            <div className="c_green">
              <ArrowUpOutlined /> 20%
            </div>
          </div>
          <h2 className="m_t_25 m_b_10 h_2">Rs 100</h2>
          <div className="box_total_count d_f a_i_f_e j_c_s_b">
            <Link className="link" to={void 0}>
              See All Users
            </Link>
            <div className="box_pr box_pr4">
              <WalletOutlined />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TotalCount