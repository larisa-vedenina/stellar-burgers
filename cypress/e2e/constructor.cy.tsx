/// <reference types="cypress" />

const baseUrl = 'http://localhost:4000/#/';

const bunId = '643d69a5c3f7b9001cfa093c'; // Краторная булка N-200i
const mainId = '643d69a5c3f7b9001cfa0941'; // Биокотлета из марсианской Магнолии
const filletId = '643d69a5c3f7b9001cfa093e'; // Филе Люминесцентного тетраодонтимформа

const modalHeader = 'Детали ингредиента';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'ingredients'
    );
    cy.visit(baseUrl);
  });

  it('добавление булки и начинки в конструктор', () => {
    cy.get(`[data-cy="${bunId}"]`).find('button').click();
    cy.get('[data-cy="bun"]').should('contain', 'Краторная булка N-200i');
    cy.get(`[data-cy="${mainId}"]`).find('button').click();
    cy.get('[data-cy="constructor-list"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('открытие модального окна ингредиента', () => {
    cy.contains(modalHeader).should('not.exist');
    cy.get(`[data-cy="${filletId}"]`).click();
    cy.contains(modalHeader).should('be.visible');
  });

  it('закрытие модального окна по крестику', () => {
    cy.get(`[data-cy="${mainId}"]`).click();
    cy.contains(modalHeader).should('be.visible');
    cy.get('[data-cy="close-modal"]').click();
    cy.contains(modalHeader).should('not.exist');
  });

  it('закрытие модального окна по оверлею', () => {
    cy.get(`[data-cy="${bunId}"]`).click();
    cy.contains(modalHeader).should('be.visible');
    // Измени селектор на актуальный для твоего оверлея!
    cy.get('.modal_overlay').click('topLeft');
    cy.contains(modalHeader).should('not.exist');
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('user');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'ingredients'
    );
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('order');
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('some-refresh-token')
    );
    cy.setCookie('accessToken', 'Bearer some-access-token');
    cy.visit(baseUrl);
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('корректное создание заказа', () => {
    cy.get(`[data-cy="${bunId}"]`).find('button').click();
    cy.get(`[data-cy="${mainId}"]`).find('button').click();
    cy.get('[data-cy="order-button"]').find('button').click();
    cy.wait('@user');
    cy.wait('@order');
    cy.get('[data-cy="order-number"]').should('contain', '76767');
    cy.get('[data-cy="close-modal"]').click();
    cy.get('[data-cy="order-number"]').should('not.exist');
    cy.contains('76767').should('not.exist');
    cy.get('[data-cy="bun"]').should('not.exist');
    cy.get('[data-cy="constructor-list"]').should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );
  });
});
