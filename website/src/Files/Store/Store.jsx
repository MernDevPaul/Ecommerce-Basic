import { configureStore } from "@reduxjs/toolkit";
import commonSlice from "./Slice/CommonSlice";
import accountSlice from "./Slice/MyAccountSlice";
import loginSlice from "./Slice/LoginSlice";

const Store = configureStore({
  reducer: {
    common: commonSlice,
    account: accountSlice,
    login: loginSlice,
  },
});

export default Store;
