import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const pagesSlice = createSlice({
  name: "pages",
  initialState: {
    pageslist: null,
    pagessingle: null,
    pagesadd: null,
    pagesedit: null,
    pagesdelete: null,
    pagesdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    pagesStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    pagesSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    pagesFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { pagesStart, pagesSuccess, pagesFailure } = pagesSlice.actions;
export default pagesSlice.reducer;
