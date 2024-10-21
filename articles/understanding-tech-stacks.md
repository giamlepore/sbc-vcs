# Backend


> Hoje vamos conversar sobre um tema essencial que sempre surge dúvida, back vs. front: o que acontece entre o momento que um cliente faz uma requisição e recebe uma resposta. O que rola por trás das cortinas?


### Front-end vs. Back-end: Qual é a Diferença?

Quando a galera fala de front-end e back-end, estamos basicamente dividindo o trabalho de uma aplicação em duas partes.

- **Front-end**: é o código que roda no lado do cliente. Ele define o que a pessoa vê e com o que interage. Isso inclui o HTML, CSS e JavaScript que rodam no navegador do usuário.
- **Back-end**: é o que acontece no servidor. É onde os dados são processados, armazenados e enviados de volta para o front-end.

Aqui, a aplicação acessa o banco de dados e responde às requisições do cliente.

No back-end também temos o banco de dados, que é essencial para guardar as informações de forma organizada e persistente, permitindo que a aplicação funcione de maneira estável e eficiente.

## Como Funciona a Relação Cliente-Servidor?

Os clientes são qualquer coisa que manda uma requisição para o back-end.

Pode ser um navegador pedindo para carregar um site, um app no celular ou até um eletrodoméstico conectado à internet. Já o servidor é o computador que fica “ouvindo” essas requisições e processando tudo.

## Os Três Pilares do Back-end

1. **Servidor**: o computador que recebe as requisições.
2. **App**: o código que roda no servidor, lida com as requisições e responde ao cliente.
3. **Banco de dados**: onde os dados são armazenados e de onde eles são recuperados quando necessário.

## O Papel do Servidor

Um servidor nada mais é que um computador conectado à rede, pronto para receber e processar requisições. Qualquer máquina pode ser configurada como servidor, até mesmo o seu computador de casa quando você está desenvolvendo.

## O Que Faz o App no Back-end?

O app que roda no servidor cuida de como responder a cada requisição. Ele usa rotas para associar um tipo de requisição (como GET, POST) com uma URL específica, e para processar isso, é comum usar middlewares.

Esses são blocos de código que são executados entre a recepção da requisição e o envio da resposta.

Esses middlewares podem modificar a requisição, acessar o banco de dados ou até passar o controle para outro middleware, até que uma resposta seja finalmente enviada.

## Tipos de Respostas

O servidor pode responder de várias maneiras: com um arquivo HTML, dados em formato JSON, ou até com um simples código de status HTTP (como o famoso 404 quando algo não é encontrado).

Essas respostas são enviadas de volta ao cliente, que vai usar esses dados para montar o que o usuário final verá.

## O Que é um Banco de Dados e Por Que Usar?

O banco de dados é a chave para guardar e recuperar informações de maneira eficiente.

Ele organiza tudo de forma que a aplicação possa acessar rapidamente os dados que precisa, sem sobrecarregar a memória principal do servidor.

Além disso, ele mantém as informações seguras, mesmo se o servidor desligar ou perder energia.

Quando o cliente faz uma requisição que envolve dados (seja para buscar ou enviar informações), o servidor se conecta ao banco de dados, faz a consulta necessária, e então retorna os dados ao cliente.

## O Que é uma API Web?

Uma API Web é basicamente uma interface que permite que diferentes softwares se comuniquem.

No contexto do back-end, a API é o conjunto de endpoints que expõem os dados da aplicação.

Ela permite que o front-end, ou até outras aplicações, acessem os recursos do back-end sem saber exatamente como os dados são armazenados.

Uma mesma API pode servir vários tipos de clientes, como um site, um app mobile, ou até mesmo outros servidores.

E o mais interessante é que uma API bem construída permite separar totalmente o front-end do back-end, facilitando o desenvolvimento de interfaces diferentes com os mesmos dados.

## O Ciclo Requisição-Resposta na Prática

Para ficar mais claro, vamos ver um exemplo:

Alice está navegando em um site de compras e clica em uma capinha de celular.

Ao fazer isso, o navegador dela manda uma requisição GET para o servidor do site, pedindo os dados da capinha (como preço, descrição e reviews).

Essa requisição viaja pela internet até chegar ao servidor do site.

O servidor, por sua vez, usa a lógica do app para acessar o banco de dados, buscar as informações da capinha e, então, montar uma resposta.

Essa resposta contém os dados que o navegador de Alice precisa para exibir todos os detalhes da capinha na tela dela.
