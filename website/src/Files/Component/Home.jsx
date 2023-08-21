import React from 'react'
import Banner from './Banner';
import TopCategory from './TopCategory';
import FeaturedProduct from './FeaturedProduct';
import FourSection from './FourSection';
import SpecialProduct from './SpecialProduct';
import Brand from './Brand';
import Blog from './Blog';


const Home = () => {
  return (
    <>
      <Banner />
      <TopCategory />
      <FeaturedProduct />
      <FourSection />
      <SpecialProduct />
      <Brand />
      <Blog />
    </>
  )
}

export default Home