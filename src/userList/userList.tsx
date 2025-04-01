import { useState } from 'react'
import { Button, Table } from 'antd';

interface User {
    id: string;
    name: string;
    email: string;
    age: number;
}

export const UserList = () => {
    const [users, setUsers] = useState<User[]>([
        { id: "1", name: "Иван Иванов", email: "ivan@example.com", age: 25 },
        { id: "2", name: "Мария Петрова", email: "maria@example.com", age: 30 },
        { id: "3", name: "Алексей Сидоров", email: "alex@example.com", age: 28 }
    ]);

    const handleDelete = (id: string) => {
        setUsers(users.filter(user => user.id !== id));
    };

    const columns = [
        { title: "Имя", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Возраст", dataIndex: "age", key: "age" },
        {
            title: "Действия",
            key: "actions",
            render: (record: User) => (
                <div style={{display: "flex", gap: "30px"}}>
                    <Button onClick={() => handleDelete(record.id)} type="default">Редактировать</Button>
                    <Button onClick={() => handleDelete(record.id)} type="default" danger>Удалить</Button>
                </div>
            )
        }
    ];
console.log(users);
    return (
        <div>
            <Table dataSource={users.map(user => ({ ...user, key: user.id }))} columns={columns} style={{}} />
        </div>
    );
}
