import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import postReducer from "./reducers/postReducer";

/**
 * Steps for State Management
 
 *  --> Submit Action
 *  --> Handle Action in it's reducers
 *  --> Register Here -> Reducer
 
 **/

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  },
});
