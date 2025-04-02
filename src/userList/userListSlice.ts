import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { User } from "./userList";

interface UsersState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as User[];
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id: string) => {
  await deleteDoc(doc(db, "users", id));
  return id;
});

const userListSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Ошибка загрузки";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export const userListReducer = userListSlice.reducer;
