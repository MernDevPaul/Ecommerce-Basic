import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderlist: null,
    ordersingle: null,
    orderadd: null,
    orderedit: null,
    orderdelete: null,
    orderdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    orderStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    orderSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    orderFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { orderStart, orderSuccess, orderFailure } =
  orderSlice.actions;
export default orderSlice.reducer;
