import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const blogtagsSlice = createSlice({
  name: "blogtags",
  initialState: {
    blogtagslist: null,
    blogtagssingle: null,
    blogtagsadd: null,
    blogtagsedit: null,
    blogtagsdelete: null,
    blogtagsdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    blogtagsStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    blogtagsSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    blogtagsFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { blogtagsStart, blogtagsSuccess, blogtagsFailure } =
  blogtagsSlice.actions;
export default blogtagsSlice.reducer;
