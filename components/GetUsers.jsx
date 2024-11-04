import { useEffect, useState } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';
const
    endpoint = 'http://localhost:3333/users';

export default function GetUsers() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3333/users');
                if (!response.ok) throw new Error('Ошибка загрузки пользователей');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setUsers(users.filter(user => user.id !== id));
            } else {
                console.error(`Не удалось удалить пользователя с ID: ${id}`);
            }
        } catch (error) {
            console.error('Ошибка при удалении: ', error);
        }
    };

    const handleAdd = async () => {
        const newUser = { name, email, phone, };
        try {
            const response = await fetch('http://localhost:3333/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            if (!response.ok) {
                throw new Error(`Ошибка при добавлении пользователя: ${response.status}`);
            }
            const data = await response.json();
            setUsers([...users, data]);
            resetForm();
        } catch (error) {
            console.error('Ошибка при добавлении пользователя: ', error);
        }
    };

    const handleEdit = (id) => {
        const user = users.find(user => user.id === id);
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone);
            setIsEdit(true);
            setEditId(id);
        }
    };

    const handleSave = async () => {
        if (editId !== null) {
            const updatedUser = { name, email, phone };
            try {
                const response = await fetch(`http://localhost:3333/users/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedUser),
                });  
                if (!response.ok) {
                    throw new Error(`Ошибка при сохранении изменений: ${response.status}`);
                }
 
                setUsers(users.map(user => user.id === editId ? { ...user, ...updatedUser } : user));
                resetForm();
            } catch (error) {
                console.error('Ошибка при сохранении изменений: ', error);
            }
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setIsEdit(false);

    };

    const handleChange = (field) => (event) => {
        switch (field) {
            case 'name':
                setName(event.target.value);
                break;
            case 'email':
                setEmail(event.target.value);
                break;
            case 'phone':
                setPhone(event.target.value);
                break;

        }
    };

    return <>
        <div className='forma'>
            <UserForm
                name={name}
                email={email}
                phone={phone}
                isEdit={isEdit}
                handleChange={handleChange}
                handleSubmit={isEdit ? handleSave : handleAdd} /></div>
        <div className='container'>
            <UserList
                users={users}
                handleEdit={handleEdit}
                handleDelete={handleDelete} /></div>
    </>;
};


