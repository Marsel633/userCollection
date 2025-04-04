import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getUserById } from "../userList/userListSlice";
import { Card, Spin, Button } from "antd";

export const GetUserById = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedUser, status } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [dispatch, id]);

  if (status === "loading") {
    return <Spin size="large" />;
  }

  if (!selectedUser) {
    return <p>Пользователь не найден.</p>;
  }

  return (
    <Card title="Информация о пользователе" style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <p><strong>Имя:</strong> {selectedUser.name}</p>
      <p><strong>Email:</strong> {selectedUser.email}</p>
      <p><strong>Возраст:</strong> {selectedUser.age}</p>
      <Button onClick={() => navigate("/")}>Назад</Button>
    </Card>
  );
};
