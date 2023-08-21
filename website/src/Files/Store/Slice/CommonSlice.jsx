import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const commonSlice = createSlice({
  name: "common",
  initialState: {
    menuslist: null,
    menussingle: null,
    categorylist: null,
    categorysingle: null,
    brandlist: null,
    brandsingle: null,
    tagslist: null,
    tagssingle: null,
    featureproductlist: null,
    featureproductsingle: null,
    hotsalelist: null,
    hotsalesingle: null,
    popularlist: null,
    relatedlist: null,
    popularsingle: null,
    companylist: null,
    companysingle: null,
    allproductslist: null,
    filterproductslist: null,
    singleproductlist: null,
    bannerlist: null,
    bannersingle: null,
    bloglist: null,
    blogsingle: null,
    isFetching: false,
    search: null,
    social: null,
    reviewadd: null,
    reviewsingle: null,
    reviewedit: null,
    reviewlist: null,
    pageslist: null,
    pagessingle: null,
    error: false,
  },
  reducers: {
    commonStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    commonSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    commonFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { commonStart, commonSuccess, commonFailure } =
  commonSlice.actions;
export default commonSlice.reducer;
