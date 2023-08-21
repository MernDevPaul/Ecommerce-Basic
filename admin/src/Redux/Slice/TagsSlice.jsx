import { createSlice } from "@reduxjs/toolkit";

const setFetchingAndError = (state, isFetching, isError) => {
  state.isFetching = isFetching;
  state.error = isError;
};

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    tagslist: null,
    tagssingle: null,
    tagsadd: null,
    tagsedit: null,
    tagsdelete: null,
    tagsdeletemany: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    tagsStart: (state) => {
      setFetchingAndError(state, true, false);
    },
    tagsSuccess: (state, action) => {
      setFetchingAndError(state, false, false);
      state[action.payload.type] = action.payload.data;
    },
    tagsFailure: (state) => {
      setFetchingAndError(state, false, true);
    },
  },
});

export const { tagsStart, tagsSuccess, tagsFailure } =
  tagsSlice.actions;
export default tagsSlice.reducer;
