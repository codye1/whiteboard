import { configureStore } from '@reduxjs/toolkit';
import canvas from './canvas';

export const store = configureStore({
  reducer: {
    canvas: canvas.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
