/// <reference types="cypress" />
//прошу прощения, работа сыровата, я завтра все правки доделаю! Сейчас уже запуталась

describe('Тесты конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('http://localhost:4000');
  });

  it('Должен отображать список ингредиентов', () => {
    cy.wait('@getIngredients');
    cy.get('[data-cy="ingredients-list"]').should('exist');
    cy.contains('Краторная булка N-200i').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  describe('Работа с ингредиентами', () => {
    it('Должен добавлять булку в конструктор', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').find('button').click();
      cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy="constructor-bun-bottom"]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy="order-price"]').should('contain', '2510'); // 1255 * 2
    });

    it('Должен добавлять начинку в конструктор', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').find('button').click();
      cy.get('[data-cy="constructor-filling"]').should('contain', 'Биокотлета из марсианской Магнолии');
      cy.get('[data-cy="order-price"]').should('contain', '424');
    });
  });

  describe('Модальные окна', () => {
    it('Должен открывать модальное окно ингредиента', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').click();
      cy.get('[data-cy="ingredient-details"]').should('exist');
      cy.contains('Детали ингредиента').should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });

    it('Должен закрывать модальное окно по крестику', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').click();
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="ingredient-details"]').should('not.exist');
    });

    it('Должен закрывать модальное окно по оверлею', () => {
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').click();
      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-cy="ingredient-details"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Моки для авторизации и создания заказа
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('postOrder');
      
      // Устанавливаем токены
      window.localStorage.setItem('refreshToken', 'test-refreshToken');
      cy.setCookie('accessToken', 'test-accessToken');
    });

    afterEach(() => {
      cy.clearLocalStorage();
      cy.clearCookies();
    });

    it('Должен создавать заказ', () => {
      // Собираем бургер
      cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').find('button').click(); // Булка
      cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').find('button').click(); // Начинка

      // Оформляем заказ
      cy.get('[data-cy="order-button"]').click();

      // Проверяем модальное окно заказа
      cy.wait('@postOrder').its('response.body.order.number').should('eq', 12345);
      cy.get('[data-cy="order-details"]').should('exist');
      cy.contains('идентификатор заказа').should('exist');
      cy.contains('12345').should('exist');

      // Закрываем модальное окно
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="order-details"]').should('not.exist');
    });
  });
});
