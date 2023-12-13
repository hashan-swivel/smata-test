// In your 'store.ts' or where you set up your Redux store
import { modalReducer } from '@/lib/features/modal/modalSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  modal: modalReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export type AppStore = typeof store;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
