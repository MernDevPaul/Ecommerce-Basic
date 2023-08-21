import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const enquirySlice = createSlice({
  name: "enquiry",
  initialState: {
    enquirylist: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    enquiryStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    enquirySuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    enquiryFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { enquiryStart, enquirySuccess, enquiryFailure } =
  enquirySlice.actions;
export default enquirySlice.reducer;
