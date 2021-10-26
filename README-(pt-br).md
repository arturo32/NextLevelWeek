# NextLevelWeek - Ecoleta
Projeto desenvolvido para o evento Next Level Week da <a href="https://rocketseat.com.br/">Rocketseat</a>.

## Resumo

<p align="center">
  <img src="https://github.com/arturo32/NextLevelWeek/blob/master/images/NLW-usage.gif">
</p>
Esse projeto é sobre um site que te permite registrar locais de coleta seletiva para que a população possa os encontrar mais facilmente em suas cidades. Ele é dividido em duas partes: o back-end com uma API RESTful em NodeJS, Express (para requisições HTTP) e Knex (para consultas em bancos de dados), já o front-end foi feito com ReactJS. MySQL foi usado ao invés de SQLite para manipulação de banco de dados.

## O que fiz de diferente 

Além da mudança no gerenciador de banco de dados, fiz mais duas alterações importantes: 

### Mapa

<p align="center">
  <img src="https://github.com/arturo32/NextLevelWeek/blob/master/images/NLW-map.gif">
</p>
O projeto original possui um mapa da <a href="https://leafletjs.com/">Leaflet API</a> e caixas de seleção com dados da <a href="https://servicodados.ibge.gov.br/api/docs/localidades?versao=1">IBGE API</a> nelas (para cidades e estados do Brasil). Adicionei uma a mais, a <a href="https://nominatim.org/release-docs/develop/api/Overview/">Nominatim API</a>, que pode obter coordenadas de um endereço e vice-versa. Dessa forma, a partir de um clique no mapa posso informar a rua, cidade e estado de um ponto.


### Responsividade

<p align="center">
  <img src="https://github.com/arturo32/NextLevelWeek/blob/master/images/NLW-responsiveness.gif">
</p>

O site original não era muito responsivo para janelas de tamanhos diferentes, então solucionei isso com um pouco de CSS, utilizando media queries e propriedades do Flexbox.

## Como rodar:
Digite os seguintes comandos em seu terminal:

```bash
# Copie o repositório
$ git clone https://github.com/arturo32/NextLevelWeek.git
# Entre no repositório
$ cd NextLevelWeek
```

### API
Nos arquivos NextLevelWeek/server/src/database/connection.ts e NextLevelWeek/server/knexfile.ts se assegure de que o "user" e "password" estão definidos de acordo com seu usuário e senha do MySQL.

Em seguida crie um banco de dados chamado "ecoleta" no MySQL. Se você usa MySQL pelo terminal, abra outro terminal e digite:


```bash
# Entre no MySQL
mysql -u root -p
# Crie o banco de dados
CREATE DATABASE ecoleta;
```

Agora de volta para o primeiro terminal, digite os seguintes comandos:

```bash
# Entre na pasta do servidor
$ cd server
# Instale as pendências (utilizando npm ou yarn)
$ npm install || yarn install 
# Preencha o banco de dados com tabelas usando knex (com npm ou yarn)
npm run knex:migrate || yarn knex:migrate
# Rode a aplicação (usando npm ou yarn)
$ npm run dev || yarn dev 
```

Se encontrar problemas com o npm `run knex:migrate` (ER_NOT_SUPPORTED_AUTH_MODE), digite os comandos abaixo em outro terminal:

```bash
# Entre no MySQL
mysql -u root -p
# Crie o banco de dados
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```
Onde "password" será sua senha atual (ou nova senha!) para acesso root do MySQL.

Acesse a API por meio de http://localhost:3333/


### Web

```bash
# Entre na página web 
$ cd web
# Instale as pendências (utilizando npm ou yarn)
$ npm install || yarn install 
# Rode a aplicação (usando npm ou yarn)
$ npm start || yarn start 
```
Acesse no seu navegador através do http://localhost:3000/ 

