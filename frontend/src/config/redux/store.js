import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";

/**
 * Steps for State Management
 
 *  --> Submit Action
 *  --> Handle Action in it's reducers
 *  --> Register Here -> Reducer
 
 **/

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
