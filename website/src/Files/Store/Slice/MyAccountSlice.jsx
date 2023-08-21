import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const accountSlice = createSlice({
  name: "account",
  initialState: {
    myaccount: null,
    getprofile: null,
    updateprofile: null,
    cartlist: null,
    cartsingle: null,
    cartadd: null,
    cartupdate: null,
    cartdelete: null,
    addressadd: null,
    addressupdate: null,
    addressdelete: null,
    addresssingle: null,
    addresslist: null,
    addressdefault: null,
    myorderlist: null,
    myordersingle: null,
    orderlist: null,
    ordersingle: null,
    wishlist: null,
    wishlistadd: null,
    wishlistdelete: null,
    paymentstart: null,
    paymentresponse: null,
    enquiryadd: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    accountStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    accountSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    accountFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { accountStart, accountSuccess, accountFailure } = accountSlice.actions;
export default accountSlice.reducer;
