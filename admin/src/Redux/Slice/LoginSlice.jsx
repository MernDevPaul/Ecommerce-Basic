import { createSlice } from "@reduxjs/toolkit";
const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    loginSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    loginFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { loginStart, loginSuccess, loginFailure } = adminSlice.actions;
export default adminSlice.reducer;
