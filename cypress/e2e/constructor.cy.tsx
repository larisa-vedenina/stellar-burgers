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

  it('Должен отображать пустой конструктор при загрузке', () => {
    cy.get('[data-cy="empty-bun-top"]').should('contain', 'Выберите булки');
    cy.get('[data-cy="empty-bun-bottom"]').should('contain', 'Выберите булки');
    cy.get('[data-cy="empty-ingredients"]').should(
      'contain',
      'Выберите начинку'
    );
  });

  it('Должен добавлять ингредиенты в конструктор', () => {
    // Добавляем булку
    cy.get(`[data-cy="${BUN_ID}"]`).find('button').click();
    cy.get('[data-cy="bun-top"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get('[data-cy="bun-bottom"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );

    // Добавляем начинку
    cy.get(`[data-cy="${MAIN_ID}"]`).find('button').click();
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    // Добавляем соус
    cy.get(`[data-cy="${SAUCE_ID}"]`).find('button').click();
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain',
      'Соус Spicy-X'
    );
  });

  it('Должен открывать и закрывать модальное окно ингредиента', () => {
    cy.get(`[data-cy="${MAIN_ID}"]`).click();
    cy.url().should('include', `/ingredients/${MAIN_ID}`);
    cy.get('[data-cy="ingredient-modal"]').should('be.visible');
    cy.get('[data-cy="close-modal"]').click();
    cy.get('[data-cy="ingredient-modal"]').should('not.exist');
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      // Добавляем ингредиенты
      cy.get(`[data-cy="${BUN_ID}"]`).find('button').click();
      cy.get(`[data-cy="${MAIN_ID}"]`).find('button').click();

      // Мокаем API
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
        'postOrder'
      );

      // Авторизация
      window.localStorage.setItem('refreshToken', 'test-token');
      cy.setCookie('accessToken', 'test-access-token');
    });

    afterEach(() => {
      cy.clearLocalStorage();
      cy.clearCookies();
    });

    it('Должен оформлять заказ и показывать номер', () => {
      cy.get('[data-cy="order-button"] button').click();

      cy.wait(['@getUser', '@postOrder']).then((interceptions) => {
        const orderResponse = interceptions[1].response?.body;
        expect(orderResponse?.success).to.be.true;
        expect(orderResponse?.order?.number).to.eq(76767);
      });

      cy.get('[data-cy="order-modal"]', { timeout: 10000 }).should(
        'be.visible'
      );
      cy.get('[data-cy="order-number"]').should('contain', '76767');

      cy.get('[data-cy="close-modal"]').click();
      cy.get('[data-cy="order-modal"]').should('not.exist');

      // Проверяем очистку конструктора
      cy.get('[data-cy="empty-bun-top"]').should('contain', 'Выберите булки');
      cy.get('[data-cy="empty-ingredients"]').should(
        'contain',
        'Выберите начинку'
      );
    });
  });
});
