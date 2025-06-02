import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "./slices/portfolio/portfolioSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      portfolio: portfolioReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
