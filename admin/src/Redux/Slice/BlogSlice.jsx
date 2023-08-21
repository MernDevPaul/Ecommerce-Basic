import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    blogslist: null,
    blogssingle: null,
    blogsadd: null,
    blogsedit: null,
    blogsdelete: null,
    blogsdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    blogsStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    blogsSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    blogsFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { blogsStart, blogsSuccess, blogsFailure } =
  blogsSlice.actions;
export default blogsSlice.reducer;
