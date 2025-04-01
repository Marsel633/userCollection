import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    status: "loading",
    error: null,
  };
  
  const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
  });
  
  export const usersReducer =  usersSlice.reducer;
  