import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const companySlice = createSlice({
  name: "company",
  initialState: {
    companylist: null,
    companysingle: null,
    companyedit: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    companyStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    companySuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    companyFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { companyStart, companySuccess, companyFailure } =
  companySlice.actions;
export default companySlice.reducer;
