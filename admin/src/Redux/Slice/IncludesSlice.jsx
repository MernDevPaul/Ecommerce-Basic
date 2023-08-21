import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const includesSlice = createSlice({
  name: "includes",
  initialState: {
    includeslist: null,
    includessingle: null,
    includesadd: null,
    includesedit: null,
    includesdelete: null,
    includesdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    includesStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    includesSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    includesFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { includesStart, includesSuccess, includesFailure } =
  includesSlice.actions;
export default includesSlice.reducer;
