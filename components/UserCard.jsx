export default function UserCard({ user, handleEdit, handleDelete }) {
  const
    { id, name, email, phone } = user;
  return <fieldset className="user-card">
      <legend>id: {id}</legend>
      <h3>{name}</h3>
      <span> 📧<a href={`mailto:${email}`}>{email}</a><br />📞<a href={`tel:${phone}`}>{phone}</a></span>
      <button onClick={() => handleEdit(user.id)}>🖊 Редактировать</button>
      <button onClick={() => handleDelete(user.id)}>❌ Удалить</button>
    </fieldset>;
}


