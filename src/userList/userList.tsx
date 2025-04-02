import { useEffect } from 'react';
import { Button, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { deleteUser, fetchUsers } from './userListSlice';
import { RootState, useAppDispatch, useAppSelector } from '../store/store';

export interface User {
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
    };

    const columns = [
        { title: "Имя", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Возраст", dataIndex: "age", key: "age" },
        {
            title: "Действия",
            key: "actions",
            render: (record: User) => (
                <div style={{ display: "flex", gap: "30px" }}>
                    <Button onClick={() => navigate(`/edit/${record.id}`)} type="default">Редактировать</Button>
                    <Button onClick={() => handleDelete(record.id)} type="default" danger>Удалить</Button>
                </div>
            )
        }
    ];

    if (status === "loading") return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div>
            <Table dataSource={users.map(user => ({ ...user, key: user.id }))} columns={columns} />
            <Button onClick={() => navigate("/create")} type="primary" style={{ marginTop: 16 }}>Добавить пользователя</Button>
        </div>
    );
}
