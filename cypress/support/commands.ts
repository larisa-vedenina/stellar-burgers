// cypress/support/commands.ts
// ==========================
//
// Кастомные команды Cypress
// Документация: https://on.cypress.io/custom-commands

declare namespace Cypress {
    interface Chainable {
      /**
       * Кастомная команда для авторизации пользователя
       * @example cy.login()
       */
      login(): Chainable<void>
    }
  }
  
  // Пример кастомной команды
  Cypress.Commands.add('login', () => {
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser')
    window.localStorage.setItem('refreshToken', 'test-refreshToken')
    cy.setCookie('accessToken', 'test-accessToken')
  })
