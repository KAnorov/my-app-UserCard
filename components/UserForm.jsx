export default function UserForm({ name, email, phone, isEdit, handleChange, handleSubmit }) {

    return <fieldset>
        <legend>{isEdit ? 'Редактирование пользователя' : 'Добавление пользователя'}</legend>
        <input value={name} onChange={handleChange('name')} placeholder="Имя" /> <br />
        <input value={email} onChange={handleChange('email')} placeholder="Email" /><br />
        <input value={phone} onChange={handleChange('phone')} placeholder="Телефон" /><br />
        <button onClick={handleSubmit}>{isEdit ? 'Сохранить' : 'Добавить'}</button>
    </fieldset>;
}


