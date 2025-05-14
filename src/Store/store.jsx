import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import CookieStorage from "../Utils/CookiesStorage";
import authReducer from './Reducers/loginSlice';
import themeReducer from './Reducers/themeSlice';
import umsReducer from './Reducers/umsSlice';
import tmsReducer from './Reducers/tmsSlice';

// Persist config for auth
const authPersistConfig = {
  key: 'auth',
  storage: CookieStorage,
  whitelist: ['user','isAuthenticated'],
};

// Persist config for theme
const themePersistConfig = {
  key: 'theme',
  storage: CookieStorage,
  whitelist: ['mode'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
    ums: umsReducer,
    tms: tmsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});


const persistor = persistStore(store);

export { store, persistor };