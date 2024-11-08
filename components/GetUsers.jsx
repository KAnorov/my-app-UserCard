import { useEffect, useState } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';
import Spinner from './Spinner';


const
    endpoint = 'http://localhost:3333/users';

export default function GetUsers() {
    const
        [users, setUsers] = useState([]),
        [name, setName] = useState(''),
        [email, setEmail] = useState(''),
        [phone, setPhone] = useState(''),
        [isEdit, setIsEdit] = useState(false),
        [editId, setEditId] = useState(null),
        [loading, setLoading] = useState(false);

    useEffect(() => {
        const
            fetchUsers = async () => {
                try {
                    const
                        response = await fetch('http://localhost:3333/users');
                    if (!response.ok) throw new Error('Ошибка загрузки пользователей');
                    const
                        data = await response.json();
                    setUsers(data);
                } catch (error) {
                    console.error(error);
                }
            };

        fetchUsers();
    }, []);

    const
        handleDelete = async (id) => {
            try {
                const
                    response = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    setUsers(users.filter(user => user.id !== id));
                } else {
                    console.error(`Не удалось удалить пользователя с ID: ${id}`);
                }
            } catch (error) {
                console.error('Ошибка при удалении: ', error);
                
            }
        };

    const
        handleAdd = async () => {
            const
                newUser = { name, email, phone, };
            setLoading(true);
            try {
                const
                    response = await fetch('http://localhost:3333/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newUser),
                    });
                if (!response.ok) {
                    throw new Error(`Ошибка при добавлении пользователя: ${response.status}`);
                    
                }
                const
                    data = await response.json();
                setUsers([...users, data]);
                resetForm();
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при добавлении пользователя: ', error);
                setLoading(false);
            }
        };

    const
        handleEdit = (id) => {
            const
                user = users.find(user => user.id === id);
            if (user) {
                setName(user.name);
                setEmail(user.email);
                setPhone(user.phone);
                setIsEdit(true);
                setEditId(id);
            }
        };

    const
        handleSave = async () => {
            if (editId !== null) {
                const
                    updatedUser = { name, email, phone };
                setLoading(true);
                try {
                    const
                        response = await fetch(`http://localhost:3333/users/${editId}`, {
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
                    setLoading(false);
                }
            }
        };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setIsEdit(false);
        setEditId(null);
        setLoading(false);

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
        {loading && <Spinner />}
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


