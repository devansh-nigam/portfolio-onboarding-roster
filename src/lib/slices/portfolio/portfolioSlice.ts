import { createSlice } from "@reduxjs/toolkit";

type StepStatus = "pending" | "current" | "completed" | "error";

interface Step {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  estimatedTime: string; // Make required
  errorMessage?: string; // Keep optional
  originalStatus?: StepStatus; // Keep optional
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // Make required and use any for flexibility
}

export interface PortfolioState {
  sections: Step;
  stepper: {
    currentStep: number;
  };
}

const initialState = {
  portfolioData: {},
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
