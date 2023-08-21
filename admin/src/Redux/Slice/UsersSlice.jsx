import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const usersSlice = createSlice({
  name: "users",
  initialState: {
    userslist: null,
    userssingle: null,
    usersadd: null,
    usersedit: null,
    usersdelete: null,
    usersdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    usersStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    usersSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    usersFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { usersStart, usersSuccess, usersFailure } =
  usersSlice.actions;
export default usersSlice.reducer;
