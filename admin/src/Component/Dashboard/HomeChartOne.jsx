import React from "react";
import { Column } from "@ant-design/plots";
import { Button } from 'antd'
import { BarChartOutlined } from "@ant-design/icons";
const HomeChartOne = () => {
  const data = [
    {
      name: "London",
      label: "Jan",
      value: 18.9,
    },
    {
      name: "London",
      label: "Feb",
      value: 28.8,
    },
    {
      name: "London",
      label: "Mar",
      value: 39.3,
    },
    {
      name: "London",
      label: "Apr",
      value: 81.4,
    },
    {
      name: "London",
      label: "May",
      value: 47,
    },
    {
      name: "London",
      label: "Jun",
      value: 20.3,
    },
    
    {
      name: "Berlin",
      label: "Jan",
      value: 12.4,
    },
    {
      name: "Berlin",
      label: "Feb",
      value: 23.2,
    },
    {
      name: "Berlin",
      label: "Mar",
      value: 34.5,
    },
    {
      name: "Berlin",
      label: "Apr",
      value: 99.7,
    },
    {
      name: "Berlin",
      label: "May",
      value: 52.6,
    },
    {
      name: "Berlin",
      label: "Jun",
      value: 35.5,
    },
    
  ];
  const config = {
    data,
    isGroup: true,
    xField: "label",
    yField: "value",
    seriesField: "name",

    color: ["#004d4d", "#f88c24"],

    label: {
      position: "middle",
      // 'top', 'middle', 'bottom'
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
  };

  return (
    <>
      <div className="cart_box">
        <div className="cart_head">
          <h4>Market Value</h4>
          <Button>
            <BarChartOutlined />
             View
          </Button>
        </div>
        <Column {...config} />
      </div>
    </>
  );
};

export default HomeChartOne;
