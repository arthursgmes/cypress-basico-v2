/// <reference types="cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function() {
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
   
    })
    it('preenche os campos obrigatórios e envia o formulário', function(){
       cy.clock()

       const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste.'
        cy.get('#firstName').type('Arthur')
        cy.get('#lastName').type('Gomes')
        cy.get('#email').type('arthur_xp@hotmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 } )
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
        cy.tick(3000)

        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.clock()
      
        cy.get('#firstName').type('Arthur')
        cy.get('#lastName').type('Gomes')
        cy.get('#email').type('arthur_xp,com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible') 
        cy.tick(3000)
        
        cy.get('.error').should('not.be.visible') 
    })

    it('campo telefone continua vazio quando preenchido com valor não-numerico', function() {
       cy.get('#phone')
       .type('abcdefghij')
       .should('have.value', '') 
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.clock()

        cy.get('#firstName').type('Arthur')
        cy.get('#lastName').type('Gomes')
        cy.get('#email').type('arthur_xp,com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible') 
        cy.tick(3000)
        
        cy.get('.error').should('not.be.visible') 

    })

    it('preenche e limpa os campos nome, sobrenome, email e tlefone', function() {
        cy.get('#firstName')
          .type('Arthur')
          .should('have.value', 'Arthur')
          .clear()
          .should('have.value', '')
          cy.get('#lastName')
          .type('Gomes')
          .should('have.value', 'Gomes')
          .clear()
          .should('have.value', '')
          cy.get('#email')
          .type('arthur.gomes@tecnotech.org')
          .should('have.value', 'arthur.gomes@tecnotech.org')
          .clear()
          .should('have.value', '')
          cy.get('#phone')
          .type('1234')
          .should('have.value', '1234')
          .clear()
          .should('have.value', '')

    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatorios', function() {
        cy.clock()

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')  
        cy.tick(3000)

        cy.get('.error').should('not.be.visible') 
        
    })

    it('envia o formulário com sucuesso usando um comando customizado', function() {
        cy.clock()

        const data = {
            firstName: 'Arthur',
            lastName: 'Gomes',
            email: 'arthur.gomes@hotmail.com',
            text: 'Texto escrito'
        }
        
        cy.fillMandatoryFieldsAndSubmit(data)
        cy.get('.success').should('be.visible')
        cy.tick(3000)

        cy.get('.success').should('not.be.visible')

    })

    it('selecionando o produto (YouTube) por seu texto.', function() {
        cy.get('#product')
          .select('YouTube')
          .should('have.value', 'youtube')
        
    })

    it('selecionando o produto (Mentoria) por seu value.', function() {
        cy.get('#product')
          .select('mentoria')
          .should('have.value', 'mentoria')

    
     })
    it('selecionando o produto (Blog) por seu índice.', function() {
        cy.get('#product')
          .select(1)
          .should('have.value', 'blog')

    })
    
    it('marca o tipo de atendimento "Feedback".', function() {
        cy.get('input[type="radio"][value="feedback"]')
          .check()
          .should('be.checked')

    })

    it('marca cada tipo de atendimento.', function() {
        cy.get('input[type="radio"]')
          .each(typeOfService => {
            cy.wrap(typeOfService)
              .check()
              .should('be.checked')
          })

    })

    it('marca ambos checkboxes, depois desmarcar o último.', function() {
        cy.get('input[type="checkbox"]')
           .check()
           .should('be.checked')
           .last()
           .uncheck()
           .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('#file-upload')
          .selectFile('cypress/fixtures/example.json')
          .should((input) => {
            expect(input[0].files[0].name).to.equal('example.json')
          })
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload')
          .selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})
          .should((input) => {
            expect(input[0].files[0].name).to.equal('example.json')
          })
    })

    it('selecione um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('#file-upload')
        .selectFile('@sampleFile')
        .should((input) => {
          expect(input[0].files[0].name).to.equal('example.json')
        })  
        
    })

    it('verifica a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.contains('a', 'Política de Privacidade')
          .should('have.attr', 'href', 'privacy.html')
          .and('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.contains('a', 'Política de Privacidade')
          .invoke('removeAttr', 'target')
          .click()

        cy.contains('h1', 'CAC TAT - Política de privacidade')
          .should('be.visible')
    })

    it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
      cy.get('.success')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Mensagem enviada com sucesso.')
        .invoke('hide')
        .should('not.be.visible')
      cy.get('.error')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide')
        .should('not.be.visible')
    })

    it('preenche o campo da área do texto usando o comando invoke', () => {
      cy.get('#open-text-area')
        .invoke('val', 'Um texto qualquer')
        .should('have.value', 'Um texto qualquer')
    })

    it('faz uma requisição HTTP', () => {
      cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
        .as('getRequest')
        .its('status')
        .should('be.equal', 200)
      cy.get('@getRequest')
        .its('statusText')
        .should('be.equal', 'OK')
      cy.get('@getRequest')
        .its('body')
        .should('include', 'CAC TAT')
    }); 
   
    it.only('desafio do encontre o gato)', () => {
        cy.get('#cat')
          .invoke('show')
          .should('be.visible')
        cy.get('#title')
          .invoke('text', 'CAT TAT')
        cy.get('#subtitle')
          .invoke('text', 'Eu <3 gatos')
    })
})