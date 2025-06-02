import { createSlice } from "@reduxjs/toolkit";
import { mockUsers } from "@/app/api/portfolio/route";

const initialState = {
  portfolioData: mockUsers[0].portfolio,
  stepper: {
    currentStep: 0,
  },
};

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setPortfolioDataFromAPI: (state, action) => {
      state.portfolioData = action.payload;
    },
    setStepperStep: (state, action) => {
      state.stepper.currentStep = action.payload;
    },
  },
});

export const { setPortfolioDataFromAPI, setStepperStep } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;
