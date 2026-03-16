import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./fileSlice";
import recordingReducer from "./recordingSlice";
import resultReducer from "./resultSlice";
import { speechApiSlice } from "./speechApiSlice";

const store = configureStore({
  reducer: {
    recording: recordingReducer,
    file: fileReducer,
    result: resultReducer,
    [speechApiSlice.reducerPath]: speechApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(speechApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
