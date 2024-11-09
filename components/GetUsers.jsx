import { useState } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import UserForm from './UserForm';
import UserList from './UserList';
import Spinner from './Spinner';

const
    endpoint = 'http://localhost:3333/users';

const
    fetcher = async () => {
        const
            response = await fetch(endpoint);
        if (!response.ok) throw new Error('Ошибка загрузки пользователей');
        return await response.json();
    };

export default function GetUsers() {
    const
        { data: users, error, isValidating, mutate } = useSWR(endpoint, fetcher),
        [name, setName] = useState(''),
        [email, setEmail] = useState(''),
        [phone, setPhone] = useState(''),
        [isEdit, setIsEdit] = useState(false),
        [editId, setEditId] = useState(null);

    const
        handleDelete = async (id) => {
            const
                promise = fetch(`${endpoint}/${id}`, { method: 'DELETE' });
            toast.promise(promise, {
                loading: 'Удаление пользователя...',
                success: () => {
                    mutate(users.filter(user => user.id !== id), false);
                    return 'Пользователь успешно удалён!';
                },
                error: (err) => `Ошибка при удалении: ${err.toString()}`,
            });

            await promise;
        };

    const
        handleAdd = async () => {
            const
                newUser = { name, email, phone },
                promise = fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                }).then(async (response) => {
                    if (!response.ok) throw new Error(`Ошибка при добавлении: ${response.status}`);
                    const
                        data = await response.json();
                    mutate([...users, data], false);
                    resetForm();
                });

            toast.promise(promise, {
                loading: 'Добавление пользователя...',
                success: 'Пользователь успешно добавлен!',
                error: (err) => `Ошибка при добавлении: ${err.toString()}`,
            });

            await promise;
        };

    const
        handleEdit = (id) => {
            const
                user = users.find(user => user.id === id);
            if (user) {
                const
                    { name, email, phone } = user;
                setName(name);
                setEmail(email);
                setPhone(phone);
                setIsEdit(true);
                setEditId(id);
            }
        };

    const
        handleSave = async () => {
            if (editId !== null) {
                const
                    updatedUser = { name, email, phone },
                    promise = fetch(`${endpoint}/${editId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedUser),
                    }).then(async (response) => {
                        if (!response.ok) throw new Error(`Ошибка при сохранении: ${response.status}`);
                        mutate(users.map(user => user.id === editId ? { ...user, ...updatedUser } : user), false);
                        resetForm();
                    });
                toast.promise(promise, {
                    loading: 'Сохранение изменений...',
                    success: 'Изменения сохранены!',
                    error: (err) => `Ошибка при сохранении: ${err.toString()}`,
                });

                await promise;
            }
        };

    const
        resetForm = () => {
            setName('');
            setEmail('');
            setPhone('');
            setIsEdit(false);
            setEditId(null);

        };

    if (error) return <div>Ошибка: {error.message}</div>;

    const
        handleChange = (field) => (event) => {
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
        {isValidating && <Spinner />}
        <div className='forma'>
            <UserForm
                name={name}
                email={email}
                phone={phone}
                isEdit={isEdit}
                handleChange={handleChange}
                handleSubmit={isEdit ? handleSave : handleAdd}
            />
        </div>
        <div className='container'>
            {users && 
                <UserList
                    users={users}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            }</div>
    </>;
}
