import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categorylist: null,
    categorysingle: null,
    categoryadd: null,
    categoryedit: null,
    categorydelete: null,
    categorydeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    categoryStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    categorySuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    categoryFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { categoryStart, categorySuccess, categoryFailure } = categorySlice.actions;
export default categorySlice.reducer;
