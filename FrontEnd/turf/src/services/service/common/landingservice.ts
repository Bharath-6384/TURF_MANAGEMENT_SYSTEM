import { LandingModel } from "../../../model/common/landingmodel";

export const LandingService = () => {

  const getSports = (): LandingModel.Sport[] => {
    return LandingModel.Sports;
  };

  const getSteps = (): LandingModel.Step[] => {
    return LandingModel.Steps;
  };

  return {
    getSports,
    getSteps,
  };
};