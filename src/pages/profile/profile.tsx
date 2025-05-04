import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  updateUser,
  fetchUser
} from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const [isLoading, setIsLoading] = useState(false);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    // Загружаем данные пользователя только если ьх еще нет
    if (!user) {
      setIsLoading(true);
      dispatch(fetchUser())
        .unwrap()
        .catch((error) => console.error('Ошибка загрузки профиля:', error))
        .finally(() => setIsLoading(false));
    } else {
      // Если пользователь уже загружен, вызывыем форму
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [dispatch, user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      // Отправляем только измененные поля
      const updatedData = {
        ...(formValue.name !== user?.name && { name: formValue.name }),
        ...(formValue.email !== user?.email && { email: formValue.email }),
        ...(formValue.password && { password: formValue.password })
      };

      dispatch(updateUser(updatedData));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <div>Ошибка загрузки профиля</div>;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
