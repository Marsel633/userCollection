import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    status: "loading",
    error: null,
  };
  
  const userListSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
  });
  
  export const userListReducer =  userListSlice.reducer;
  