import express from 'express'; // usado para criar router dentro da aplicação.
import routes from './router';
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cors());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors())

app.listen(3333);