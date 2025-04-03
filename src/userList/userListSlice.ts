import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { IUser } from "./userList";
import axios from "axios";

interface UsersState {
  users: IUser[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const data = await axios.get(`https://firestore.googleapis.com/v1/projects/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents/users?key=${import.meta.env.VITE_FIREBASE_API_KEY}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.data.documents.map((doc: any) => {
            const fields = doc.fields;
            return {
                id: doc.name.split("/").pop()!,
                name: fields.name.stringValue,
                email: fields.email.stringValue,
                age: Number(fields.age.integerValue),
            };
        });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
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
