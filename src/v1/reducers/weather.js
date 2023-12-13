import { WEATHER_DATA } from '../actions/types';

const initialState = {};

export const weather = (state = initialState, action) => {
  switch (action.type) {
    case WEATHER_DATA: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
};
