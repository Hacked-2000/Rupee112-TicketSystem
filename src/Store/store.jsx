import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Reducers/loginSlice';
import themeReducer from './Reducers/themeSlice';
import umsReducer from './Reducers/umsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    ums: umsReducer,
  },
});

export default store;