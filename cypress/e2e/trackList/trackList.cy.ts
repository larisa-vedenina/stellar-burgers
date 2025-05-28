describe('проверяем доступность приложения', function() {
    it('сервис должен быть доступен по адресу', function() {
        cy.visit('http://localhost:4000/'); 
    });
});
