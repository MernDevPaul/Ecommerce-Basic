import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const countrySlice = createSlice({
  name: "country",
  initialState: {
    countrylist: null,
    countrysingle: null,
    countryadd: null,
    countryedit: null,
    countrydelete: null,
    countrydeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    countryStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    countrySuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    countryFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { countryStart, countrySuccess, countryFailure } = countrySlice.actions;
export default countrySlice.reducer;
