import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const webmenusSlice = createSlice({
  name: "webmenus",
  initialState: {
    webmenuslist: null,
    webmenussingle: null,
    webmenusadd: null,
    webmenusedit: null,
    webmenusdelete: null,
    webmenusdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    webmenusStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    webmenusSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    webmenusFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { webmenusStart, webmenusSuccess, webmenusFailure } = webmenusSlice.actions;
export default webmenusSlice.reducer;
