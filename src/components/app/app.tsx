import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { fetchUser } from '../../services/slices/userSlice';
import { OnlyAuth, OnlyUnAuth } from '../protected-route/protected-route';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, OrderInfo } from '@components';
import { Modal } from '../modal/modal';
import { Preloader } from '@ui';

const App = () => {
  console.log('API URL:', process.env.BURGER_API_URL);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { isLoading: ingredientsLoading, error: ingredientsError } =
    useSelector((state) => state.ingredients);
  const { isAuthChecked, isLoading: userLoading } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchIngredients()).unwrap();
        dispatch(fetchFeeds());

        // Проверяем наличие токена перед запросом
        const token = localStorage.getItem('refreshToken');
        if (token) {
          await dispatch(fetchUser()).unwrap();
        } else {
          dispatch({ type: 'user/authCheck' });
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadData();
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  if (isInitialLoad || ingredientsLoading || (userLoading && !isAuthChecked)) {
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Основные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* по защищённому роуту */}
        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyUnAuth component={<ResetPassword />} />}
        />
        <Route path='/profile' element={<OnlyAuth component={<Profile />} />} />
        <Route
          path='/profile/orders'
          element={<OnlyAuth component={<ProfileOrders />} />}
        />

        {/* маршрут для 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
