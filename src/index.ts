import {App} from './app';
import * as morgan from 'morgan';

//TODO: read from env the port
//TODO: connect to db
//TODO: change morgan to run as dev or as prod
const app = new App(3000, morgan('dev'), []);
app.listen();
