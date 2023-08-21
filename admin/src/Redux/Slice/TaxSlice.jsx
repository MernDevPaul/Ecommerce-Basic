import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const taxSlice = createSlice({
  name: "tax",
  initialState: {
    taxlist: null,
    taxsingle: null,
    taxadd: null,
    taxedit: null,
    taxdelete: null,
    taxdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    taxStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    taxSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    taxFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { taxStart, taxSuccess, taxFailure } =
  taxSlice.actions;
export default taxSlice.reducer;
