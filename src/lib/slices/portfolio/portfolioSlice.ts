import { createSlice } from "@reduxjs/toolkit";

type StepStatus = "pending" | "current" | "completed" | "error";

interface Step {
  map(
    arg0: (
      section: Step,
      index: number
    ) => {
      originalStatus: "current" | "completed" | "pending" | "error";
      status: "current" | "completed" | "pending" | "error";
      id: number;
      title: string;
      description: string;
      estimatedTime: string;
      errorMessage?: string;
      data: any;
    }
  ): unknown;
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  estimatedTime: string;
  errorMessage?: string;
  originalStatus?: StepStatus;
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
