import {App} from './app';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';

//TODO: change considering NODE_ENV
dotenv.config({path: '.env.dev'});
//TODO: connect to db
//TODO: change morgan to run as dev or as prod
const app = new App(Number(process.env.API_PORT), morgan('dev'), []);
app.listen();
