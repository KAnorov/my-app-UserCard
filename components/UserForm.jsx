export default function UserForm({ name, email, phone, isEdit, handleChange, handleSubmit }) {

    return <fieldset>
        <legend>{isEdit ? 'Редактирование пользователя' : 'Добавление пользователя'}</legend>
        <input placeholder="Имя" value={name} onChange={handleChange('name')} />
        <input placeholder="Email" value={email} onChange={handleChange('email')} />
        <input placeholder="Телефон" value={phone} onChange={handleChange('phone')} />
        <button onClick={handleSubmit}>{isEdit ? 'Сохранить' : 'Добавить'}</button>
    </fieldset>;
}


