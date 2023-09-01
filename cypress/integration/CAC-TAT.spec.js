/// <reference types="Cypress" />
// sempre que for iniciar o código, preciso visitar uma página
//Describe para ter a descrição do código
describe('Central de Atendimento ao Cliente TAT', function () {
  this.beforeEach(function () {
    cy.visit('./src/index.html')
  })
  // Verificar o titulo da minha aplicação
  it('verifica o título da aplicação', function () {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })
  // o delay faz com que o teste seja mais rapido por ter - texto longo na caixa de texto,
  //o delay facilita avizualização na aplicação mas em modo readless ele demora mais para ser executado
  it('preenche os campos obrigatórios e envia o formulário', function () {
    cy.get('#firstName').type('Caue')
    cy.get('#lastName').type('Lopes')
    cy.get('#email').type('kitoypp@hotmail.com')
    cy.get('#open-text-area').type('teste teste teste teste teste teste teste teste teste teste', { delay: 0 })
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')
  })
  // o elemento com classe error, para verificar formataçao invalida - .error
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
    cy.get('#firstName').type('Caue')
    cy.get('#lastName').type('Lopes')
    cy.get('#email').type('kitoypphotmail.com')
    cy.get('#open-text-area').type('teste teste teste teste teste teste teste teste teste teste', { delay: 0 })
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
  })
  //aqui digito com caracteres nao numericos, e como o formulario nao reconhece
  // ele permanece vazio, entao "tem.vazio"  = have.vaue, ''
  it('campo de telefone continua vazio quando preenchido com valor não-numerico', function () {

    cy.get('#phone').type('askapskapso').should('have.value', '')

  })
  //Aqui por exemplo o telefone (pois acionamos o check-box da condicional)
  //é exigido e porem nao preenchido, como vimos acima é só verificar mensagem de erro novamente
  it('exibir mensagem de erro quando o telefone é obrigatorio porem nao é preenchido', function () {
    cy.get('#firstName').type('Caue')
    cy.get('#lastName').type('Lopes')
    cy.get('#email').type('kitoypphotmail.com')
    cy.get('#open-text-area').type('teste teste teste teste teste teste teste teste teste teste', { delay: 0 })
    cy.get('#phone-checkbox').check()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })
  //.clear limpa um campo que ja foi preenchido para verificar se nao a problemas em apagar o que ja foi escrito
  it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
    cy.get('#firstName')
      .type('Caue')
      .should('have.value', 'Caue')
      .clear()
      .should('have.value', '')
    cy.get('#lastName')
      .type('Lopes')
      .should('have.value', 'Lopes')
      .clear()
      .should('have.value', '')
    cy.get('#email')
      .type('kitoypphotmail.com')
      .should('have.value', 'kitoypphotmail.com')
      .clear()
      .should('have.value', '')
    cy.get('#phone')
      .type('11940088931')
      .should('have.value', '11940088931')
      .clear()
      .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')

  })
  //para evitar duplicação de código
  it('envia o formuário com sucesso usando um comando customizado', function () {
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
  })
  //Lista de seletores para escolher um especifico e validar
  it('seleciona um produto (YouTube) por seu texto', function () {
    cy.get('select').select('YouTube').should('have.value', 'youtube')

  })
  //pelo valor do value do seletor css e não o texto pode ver que mentoria esta em minusculo
  it('seleciona um produto (Mentoria) por seu valor (value)', function () {
    cy.get('select').select('mentoria').should('have.value', 'mentoria')
  })
  // selecionar atraves da ordem em que ele se encontra e validar pelo value  
  it('seleciona um produto (Blog) por seu índice', function () {
    cy.get('select').select(1).should('have.value', 'blog')
  })
  // marquei o tipo do radio que eu quero marcar, e dei um check marcando ele - poderia ser click
  it('marca o tipo de atendimento "Feedback"', function () {
    cy.get('input[type="radio"][value="feedback').check().should('have.value', 'feedback')
  })
  // Aqui além de marcar cada um dos radios eu faço a verificação de que eles foram marcado com uma função
  //repara que no teste de cima eu pego um especifico e aqui eu pego todos pois nao especifico qual eu peguei
  //entaolooping criado para ir armazenando verificando e dando check um a um
  it('marca cada tipo de atendimento', function () {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function ($radio) {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })
  // aqui a mesma coisa, por nao ter especificado eu pego os dois
  //checo os dois, porem eu tiro o check somente do ultimo, e por ordem da linha de código ao passar o should apos
  //o ultimo o mesmo ja verifica se ele nao esta valido
  it.only('marca ambos checkboxes, depois desmarca o último', function () {
    cy.get('input[type="checkbox"]')
      .check()
      .last()
      .uncheck()
      .should('not.be.checked')
  })
  //Aqui eu faço um upload de arquivo
  it('seleciona um arquivo da pasta fixtures', function () {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json')
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })

  })
  // Aqui eu fiz o upload arrastando o arquivo
  it('seleciona um arquivo simulando um drag-and-drop', function () {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })
  // nao precisa clicar, pois o comportamento padrão para ir para outra pagina é o target=blank / e should com atribute
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })
  // removendo o target que é o padrão de ir para próx aba, conseguimos fazer com que o cypress identifique a pagina já que ela nao vai abrir em uma nova aba e sim na mesma
  it('acessa a página da política de privacidade removendo o target e então clicando no link', function () {
    cy.get('#privacy a').invoke('removeAttr', 'target').click()
    cy.contains('Talking About Testing').should('be.visible')
  })
})


