import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const socialSlice = createSlice({
  name: "social",
  initialState: {
    sociallist: null,
    socialsingle: null,
    socialadd: null,
    socialedit: null,
    socialdelete: null,
    socialdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    socialStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    socialSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    socialFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { socialStart, socialSuccess, socialFailure } =
  socialSlice.actions;
export default socialSlice.reducer;
