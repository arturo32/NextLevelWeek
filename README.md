# NextLevelWeek - Ecoleta

Project developed for the Next Level Week event by <a href="https://rocketseat.com.br/">Rocketseat</a>.

##  Overview

<p align="center">
  <img src="https://github.com/arturo32/NextLevelWeek/blob/master/images/NLW-usage.gif">
</p>

This project it's about a site that allows you to register a recycling collection point, so people can find one more easily in their city. It is divided in two parts: the back-end, an restful API made with NodeJS, Express (for HTTP requests) and Knex (for database queries), and the front-end, made with ReactJS. MySQL was used instead of SQLite for the database management.

## What I did differently  

Besides the change in the database manager, I did two more main alterations:

### Map

<p align="center">
  <img src="https://github.com/arturo32/NextLevelWeek/blob/master/images/NLW-map.gif">
</p>

The original project have a map from the <a href="https://leafletjs.com/">Leaflet API</a> and selection boxes with <a href="https://servicodados.ibge.gov.br/api/docs/localidades?versao=1">IBGE API</a> data in them (city and states from Brazil). I have added one more, the <a href="https://nominatim.org/release-docs/develop/api/Overview/">Nominatim API</a>, that can give coordinates of an address and vice-versa. That way, from a click in the map, I can give the state, city and street of a point.

### Responsiveness

<p align="center">
  <img src="https://github.com/arturo32/NextLevelWeek/blob/master/images/NLW-responsiveness.gif">
</p>

The original site wasn't very responsive to different windows sizes. I fixed that with a bit of CSS, messing around with media queries and Flexbox properties.

## How to run

Type the following commands in your terminal:

```bash
# Clone the repository
$ git clone https://github.com/arturo32/NextLevelWeek.git
# Enter the repository
$ cd NextLevelWeek
```

### API

In the files NextLevelWeek/server/src/database/connection.ts AND NextLevelWeek/server/knexfile.ts make sure that "user" and "password" are set accordingly with your user and password of MySQL.

Next, create a database named "ecoleta" in MySQL. If you use MySQL in the terminal, open another terminal and type:

```bash
# Enter MySQL
mysql -u root -p
# Create database
CREATE DATABASE ecoleta;
```


Then, back to your first terminal, type the following commands:

```bash
# Enter the server folder
$ cd server
# Install the dependencies (using npm or yarn)
$ npm install || yarn install 
# Fill the proffy database with tables using knex (with npm or yarn)
npm run knex:migrate || yarn knex:migrate
# Run the app (using npm or yarn)
$ npm run dev || yarn dev 
```


If you find problems with the npm `run knex:migrate` (ER_NOT_SUPPORTED_AUTH_MODE), then you have to type the following commands in another terminal:
```bash
# Enter MySQL
mysql -u root -p
# Create database
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```
Where password will be your current password (or new password!) for root access of MySQL.

Access API through http://localhost:3333/


### Web

```bash
# Enter the web folder
$ cd web
# Install the dependencies (using npm or yarn)
$ npm install || yarn install 
# Run the app (using npm or yarn)
$ npm start || yarn start 
```

Access in your browser through http://localhost:3000/ 

