import React from "react";
import { Pie } from "@ant-design/plots";
import { Button } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
const HomeChartTwo = () => {
 
  const data = [
    {
      type: "Coimbatore",
      value: 27,
    },
    {
      type: "Chennai",
      value: 25,
    },
    {
      type: "Selam",
      value: 18,
    },
    {
      type: "Madurai",
      value: 15,
    },
    {
      type: "Therunelveli",
      value: 10,
    },
    {
      type: "Erode",
      value: 5,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.75,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name}\n{percentage}",
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
  };

  return (
    <>
      <div className="cart_box">
        <div className="cart_head">
          <h4>Sales By Location</h4>
          <Button>
            <PieChartOutlined />
            View
          </Button>
        </div>
        <Pie {...config} />
      </div>
    </>
  );
};

export default HomeChartTwo;
