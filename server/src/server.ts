import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

var users = [
	{name: 'Arturo', email: 'arturo@gmail.com'},
	{name:'Paulo', email: 'paulo@gmail.com'},
	{name:'Fernando', email: 'fernando@gmail.com'},
	{name:	'Diego', email: 'diego@gmail.com'}
];

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));


app.listen(3333);
