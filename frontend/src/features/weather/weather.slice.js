// weather.slice.js
// Lightweight state management for weather feature
// (No Redux needed — using React hooks; this file reserved for future Redux/Zustand migration)

export const WEATHER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_DATA: 'SET_DATA',
  SET_ERROR: 'SET_ERROR',
  SET_LOCATION: 'SET_LOCATION',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

export const weatherReducer = (state, action) => {
  switch (action.type) {
    case WEATHER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    case WEATHER_ACTIONS.SET_DATA:
      return { ...state, loading: false, data: action.payload, error: null };
    case WEATHER_ACTIONS.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    case WEATHER_ACTIONS.SET_LOCATION:
      return { ...state, coords: action.payload };
    case WEATHER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const initialWeatherState = {
  loading: true,
  data: null,
  error: null,
  coords: { lat: 18.5204, lon: 73.8567 }, // Default: Pune, India
};
