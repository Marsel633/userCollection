import { useEffect } from 'react';
import { Button, Spin, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { deleteUser, fetchUsers } from './userListSlice';
import { RootState, useAppDispatch, useAppSelector } from '../store/store';
import { toast } from 'react-toastify';

export interface IUser {
    id: string;
    name: string;
    email: string;
    age: number;
}

export const UserList = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { users, status, error } = useAppSelector((state: RootState) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "users", id));
        dispatch(deleteUser(id));
        toast.success("Пользователь успешно удален!")
    };

    const columns = [
        { title: "Имя", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Возраст", dataIndex: "age", key: "age" },
        {
            title: "Действия",
            key: "actions",
            render: (record: IUser) => (
                <div style={{ display: "flex", gap: "30px" }}>
                    <Button onClick={() => navigate(`/edit/${record.id}`)} type="default">Редактировать</Button>
                    <Button onClick={() => handleDelete(record.id)} type="default" danger>Удалить</Button>
                    <Button onClick={() => navigate(`/user/${record.id}`)} type="default">Информация</Button>
                </div>
            )
        }
    ];

    if (status === "loading") return <Spin size="large" />;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div>
            <Table dataSource={users} columns={columns} pagination={{pageSize: 5}} rowKey="id"/>
            <Button onClick={() => navigate("/create")} type="primary" style={{ marginTop: 16 }}>Добавить пользователя</Button>
        </div>
    );
}
