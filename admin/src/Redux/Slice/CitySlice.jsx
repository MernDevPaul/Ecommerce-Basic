import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const citySlice = createSlice({
  name: "city",
  initialState: {
    citylist: null,
    citysingle: null,
    cityadd: null,
    cityedit: null,
    citydelete: null,
    citydeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    cityStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    citySuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    cityFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { cityStart, citySuccess, cityFailure } =
  citySlice.actions;
export default citySlice.reducer;
