import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

import { NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  // Функция для определения активного класса
  const getActiveClass = (isActive: boolean) =>
    `${styles.link} ${isActive ? styles.link_active : ''}`;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        {/*  конструктор и лента заказов */}
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) => getActiveClass(isActive)}
            end
          >
            <div className={styles.menu_item}>
              <BurgerIcon type='primary' />
              <span className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </span>
            </div>
          </NavLink>

          <NavLink
            to='/feed'
            className={({ isActive }) => getActiveClass(isActive)}
          >
            <div className={styles.menu_item}>
              <ListIcon type='primary' />
              <span className='text text_type_main-default ml-2'>
                Лента заказов
              </span>
            </div>
          </NavLink>
        </div>

        {/* логотип */}
        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className={styles.logo_image} />
          </NavLink>
        </div>

        {/* личный кабинет */}
        <NavLink
          to='/profile'
          className={({ isActive }) => getActiveClass(isActive)}
        >
          <div className={styles.menu_item}>
            <ProfileIcon type='primary' />
            <span className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </span>
          </div>
        </NavLink>
      </nav>
    </header>
  );
};
