import React from 'react'
import { Breadcrumb } from "antd";
import TotalCount from './TotalCount';
import HomeChartOne from './HomeChartOne';
import HomeChartTwo from './HomeChartTwo';
import HomeChartThree from './HomeChartThree';
const Home = ({ title }) => {
  console.log("title", title);
  const item = [
    {
      title: "Home",
    },
    {
      title: title,
    },
  ];
  return (
    <>
      <Breadcrumb items={item} />
      <div className="col_1 g_25 m_t_25">
        <TotalCount />
        <div className="col_2 g_25 col_1_xl">
          <HomeChartOne />
          <HomeChartTwo />
        </div>
        {/* <div className='col_1'>
          <HomeChartThree />
        </div> */}
      </div>
    </>
  );
}

export default Home