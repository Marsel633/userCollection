import { ToastContainer } from "react-toastify";
import { UserList } from "./userList/userList";
import { BrowserRouter, Route, Routes } from "react-router";
import { CreateUser } from "./createUser/CreateUser";
import { EditUser } from "./editUser/EditUser";
import { GetUserById } from "./getUserById/GetUserById";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/create" element={<CreateUser/>} />
        <Route path="/edit/:id" element={<EditUser/>} />
        <Route path="/user/:id" element={<GetUserById/>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
