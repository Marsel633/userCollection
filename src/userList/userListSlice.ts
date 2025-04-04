import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { IUser } from "./userList";
import axios from "axios";

interface IUsersState {
  users: IUser[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: IUsersState = {
  users: [],
  status: "idle",
  error: null,
};

interface IFirestoreUser {
  name: string;
  fields: {
    name: { stringValue: string };
    email: { stringValue: string };
    age: { integerValue: number };
  };
}

const url = `https://firestore.googleapis.com/v1/projects/${
  import.meta.env.VITE_FIREBASE_PROJECT_ID
}/databases/(default)/documents/users?key=${
  import.meta.env.VITE_FIREBASE_API_KEY
}`;
console.log(url);

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const data = await axios.get<{ documents: IFirestoreUser[] }>(url);
    return data.data.documents.map((doc) => {
      const fields = doc.fields;
      return {
        id: doc.name.split("/").pop()!,
        name: fields.name.stringValue,
        email: fields.email.stringValue,
        age: Number(fields.age.integerValue),
      };
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const addUser = createAsyncThunk(
  "users/addUser",
  async (
    userData: { name: string; email: string; age: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(url, {
        fields: {
          name: { stringValue: userData.name },
          email: { stringValue: userData.email },
          age: { integerValue: userData.age },
        },
      });

      const newUser: IUser = {
        id: response.data.name.split("/").pop()!,
        name: userData.name,
        email: userData.email,
        age: userData.age,
      };

      return newUser;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Ошибка при добавлении пользователя"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string) => {
    await deleteDoc(doc(db, "users", id));
    return id;
  }
);

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
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.status = "succeeded";
      })
      .addCase(
        addUser.fulfilled,
        (state, { payload }: PayloadAction<IUser>) => {
          state.users.push(payload);
          state.status = "succeeded";
        }
      )
      .addCase(addUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const userListReducer = userListSlice.reducer;
