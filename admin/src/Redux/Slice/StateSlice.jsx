import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const stateSlice = createSlice({
  name: "state",
  initialState: {
    statelist: null,
    statesingle: null,
    stateadd: null,
    stateedit: null,
    statedelete: null,
    statedeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    stateStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    stateSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    stateFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { stateStart, stateSuccess, stateFailure } =
  stateSlice.actions;
export default stateSlice.reducer;
