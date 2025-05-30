/// <reference types="cypress" />

describe('Конструктор бургеров', () => {
  const BASE_URL = 'http://localhost:4000';
  const BUN_ID = '643d69a5c3f7b9001cfa093d'; // Флюоресцентная булка R2-D3
  const MAIN_ID = '643d69a5c3f7b9001cfa0941'; // Биокотлета из марсианской Магнолии
  const SAUCE_ID = '643d69a5c3f7b9001cfa0942'; // Соус Spicy-X

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit(BASE_URL);
    cy.wait('@getIngredients');
  });

  it('Должен добавлять ингредиент в конструктор', () => {
    cy.get('[data-cy="empty-bun-top"]').should('exist');
    cy.get('[data-cy="empty-bun-bottom"]').should('exist');
    cy.get('[data-cy="empty-ingredients"]').should('exist');

    cy.get(`[data-cy="${BUN_ID}"]`).find('button').click();
    cy.get('[data-cy="bun-top"]').should('exist');
    cy.get('[data-cy="bun-bottom"]').should('exist');

    cy.get(`[data-cy="${MAIN_ID}"]`).find('button').click();
    cy.get('[data-cy="constructor-ingredients"]')
      .children()
      .should('have.length.gt', 0);
  });

  it('Должен открывать и закрывать модальное окно с деталями ингредиента', () => {
    cy.get(`[data-cy="${SAUCE_ID}"]`).click();

    cy.get('[data-cy="ingredient-details"]').should('exist');
    cy.url().should('include', `/ingredients/${SAUCE_ID}`);

    cy.get('[data-cy="close-modal"]').click();
    cy.get('[data-cy="ingredient-details"]').should('not.exist');
    cy.url().should('eq', `${BASE_URL}/`);
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
        'postOrder'
      );

      window.localStorage.setItem('refreshToken', 'test-refreshToken');
      cy.setCookie('accessToken', 'test-accessToken');

      // Добавляем ингредиенты перед каждым тестом заказа
      cy.get(`[data-cy="${BUN_ID}"]`).find('button').click();
      cy.get(`[data-cy="${MAIN_ID}"]`).find('button').click();
    });

    afterEach(() => {
      cy.clearLocalStorage();
      cy.clearCookies();
    });

    it('Должен оформлять заказ и показывать номер', () => {
      // Проверяем, что ингредиенты добавлены
      cy.get('[data-cy="bun-top"]').should('exist');
      cy.get('[data-cy="constructor-ingredients"]')
        .children()
        .should('have.length.gt', 0);

      // Проверяем и кликаем кнопку заказа
      cy.get('[data-cy="order-button"] button')
        .should('not.be.disabled')
        .click();

      // Ждем выполнения запросов
      cy.wait(['@getUser', '@postOrder']);

      // Добавляем задержку для появления модального окна
      cy.get('[data-cy="order-modal"]', { timeout: 10000 }).should('exist');
      cy.get('[data-cy="order-modal"]').should('contain', '76767');

      // Закрываем модальное окно
      cy.get('[data-cy="close-modal"]').click();
      cy.get('[data-cy="order-modal"]').should('not.exist');

      // Проверяем очистку конструктора
      cy.get('[data-cy="empty-bun-top"]').should('exist');
      cy.get('[data-cy="empty-ingredients"]').should('exist');
    });
  });
});
