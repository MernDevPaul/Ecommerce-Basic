import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./Slice/LoginSlice";
import countrySlice from "./Slice/CountrySlice";
import stateSlice from "./Slice/StateSlice";
import citySlice from "./Slice/CitySlice";
import companySlice from "./Slice/CompanySlice";
import usersSlice from "./Slice/UsersSlice";
import staffSlice from "./Slice/StaffSlice";
import taxSlice from "./Slice/TaxSlice";
import tagsSlice from "./Slice/TagsSlice";
import categorySlice from "./Slice/CategorySlice";
import brandsSlice from "./Slice/BrandsSlice";
import bannersSlice from "./Slice/BannersSlice";
import productsSlice from "./Slice/ProductsSlice";
import blogCategorySlice from "./Slice/BlogcategorySlice";
import blogtagsSlice from "./Slice/BlogtagsSlice";
import blogSlice from "./Slice/BlogSlice";
import pagesSlice from "./Slice/PagesSlice";
import webmenusSlice from "./Slice/WebmenusSlice";
import includesSlice from "./Slice/IncludesSlice";
import orderSlice from "./Slice/OrderSlice";
import enquirySlice from "./Slice/EnquirySlice";
import socialSlice from "./Slice/SocialMediaSlice";


const Store = configureStore({
  reducer: {
    admin: adminSlice,
    country: countrySlice,
    state: stateSlice,
    city: citySlice,
    company: companySlice,
    users: usersSlice,
    staff: staffSlice,
    tax: taxSlice,
    tags: tagsSlice,
    category: categorySlice,
    brands: brandsSlice,
    banners: bannersSlice,
    products: productsSlice,
    blogcategory: blogCategorySlice,
    blogtags: blogtagsSlice,
    blogs: blogSlice,
    pages: pagesSlice,
    webmenus: webmenusSlice,
    includes: includesSlice,
    order: orderSlice,
    enquiry: enquirySlice,
    social: socialSlice,
  },
});

export default Store;
