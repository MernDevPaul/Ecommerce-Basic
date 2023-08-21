import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const blogcategorySlice = createSlice({
  name: "blogcategory",
  initialState: {
    blogcategorylist: null,
    blogcategorysingle: null,
    blogcategoryadd: null,
    blogcategoryedit: null,
    blogcategorydelete: null,
    blogcategorydeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    blogcategoryStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    blogcategorySuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    blogcategoryFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { blogcategoryStart, blogcategorySuccess, blogcategoryFailure } =
  blogcategorySlice.actions;
export default blogcategorySlice.reducer;
