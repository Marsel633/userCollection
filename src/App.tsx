import { ToastContainer } from "react-toastify";
import { UserList } from "./userList/userList";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/create" element="Create User" />
        <Route path="/edit/:id" element="Edit User" />
        <Route path="/user/:id" element="User By Id" />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
