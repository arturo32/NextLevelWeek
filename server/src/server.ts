import express from 'express'
import routes from './routes'

const app = express();

app.use(express.json());

app.use(routes);

var users = [
	{name: 'Arturo', email: 'arturo@gmail.com'},
	{name:'Paulo', email: 'paulo@gmail.com'},
	{name:'Fernando', email: 'fernando@gmail.com'},
	{name:	'Diego', email: 'diego@gmail.com'}
];




app.listen(3333);
