import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';
import feedReducer from './feedSlice'
import connectionReducer from './connectionsSclice'
import requestReducer from './requestSlice'
const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    Connections: connectionReducer,
    requests: requestReducer
  },
})

export default appStore;