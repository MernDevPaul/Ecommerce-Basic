import React from 'react'
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
} from "@ant-design/icons";
const BreadcrumbDynamic = ({title}) => {
  const navigate = useNavigate();
    const item = [
      {
        title: "Home",
      },
      {
        title: title,
      },
    ];
  return (
    <div className="table_head">
      <p onClick={() => navigate(-1)} className="go_back">
        <ArrowLeftOutlined /> &nbsp;Back
      </p>
      <Breadcrumb items={item} />
    </div>
  );
}

export default BreadcrumbDynamic;