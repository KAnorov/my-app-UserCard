import UserCard from './UserCard';

export default function UserList({ users, handleEdit, handleDelete }) {
  return <>
    <h2>Список пользователей</h2>
    <ul>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          handleEdit={handleEdit}
          handleDelete={handleDelete} />
      ))}
    </ul>
  </>;
}