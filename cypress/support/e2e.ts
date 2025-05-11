import './commands'

// Обработка необработанных исключений в приложении
Cypress.on('uncaught:exception', (err) => {
  console.error('Uncaught exception:', err)
  // Возвращаем false чтобы предотвратить падение теста
  return false
})
