import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    stafflist: null,
    staffsingle: null,
    staffadd: null,
    staffedit: null,
    staffdelete: null,
    staffdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    staffStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    staffSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    staffFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { staffStart, staffSuccess, staffFailure } = staffSlice.actions;
export default staffSlice.reducer;
