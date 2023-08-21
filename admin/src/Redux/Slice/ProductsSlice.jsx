import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const productsSlice = createSlice({
  name: "products",
  initialState: {
    productslist: null,
    productssingle: null,
    productsadd: null,
    productsedit: null,
    productsdelete: null,
    productsdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    productsStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    productsSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    productsFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { productsStart, productsSuccess, productsFailure } =
  productsSlice.actions;
export default productsSlice.reducer;
