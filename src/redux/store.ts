import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import persistedReducer from "./rootReducer";
import { api } from "./api/api";

// Configure the Redux store with RTK Query middleware.
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

const persistor = persistStore(store);

export { persistor, store };
export type IRootState = ReturnType<typeof store.getState>;
