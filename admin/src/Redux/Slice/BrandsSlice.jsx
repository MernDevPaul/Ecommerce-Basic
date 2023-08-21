import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    brandslist: null,
    brandssingle: null,
    brandsadd: null,
    brandsedit: null,
    brandsdelete: null,
    brandsdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    brandsStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    brandsSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    brandsFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { brandsStart, brandsSuccess, brandsFailure } =
  brandsSlice.actions;
export default brandsSlice.reducer;
