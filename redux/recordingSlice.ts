import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RecordingInitialState = {
  uri: string | null;
  state: "recording" | "result";
};

let initialState: RecordingInitialState = {
  uri: null,
  state: "recording",
};

export const recordingSlice = createSlice({
  name: "recording",
  initialState,
  reducers: {
    setRecordingUri: (state, action: PayloadAction<string>) => {
      state.uri = action.payload;
    },
    cleanUpRecordingUri: (state) => {
      state.uri = null;
    },
    setShowState: (state, action: PayloadAction<"recording" | "result">) => {
      state.state = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const { setRecordingUri, cleanUpRecordingUri, setShowState } =
  recordingSlice.actions;
export default recordingSlice.reducer;
