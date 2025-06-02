import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  portfolioData: {},
};

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setPortfolioDataFromAPI: (state, action) => {
      state.portfolioData = action.payload;
    },
  },
});

export const { setPortfolioDataFromAPI } = portfolioSlice.actions;
export default portfolioSlice.reducer;
