import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const bannersSlice = createSlice({
  name: "banners",
  initialState: {
    bannerslist: null,
    bannerssingle: null,
    bannersadd: null,
    bannersedit: null,
    bannersdelete: null,
    bannersdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    bannersStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    bannersSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    bannersFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { bannersStart, bannersSuccess, bannersFailure } =
  bannersSlice.actions;
export default bannersSlice.reducer;
