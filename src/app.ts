import * as express from 'express';
import * as cors from 'cors';
import {Controller} from './controller/controller';
import {errorMiddleware} from './errors/errorsHandler';

export class App {
    private app: express.Application;
    private port: number;

    constructor(
        port: number,
        morgan: express.RequestHandler,
        controllers: Controller[]
    ) {
        this.app = express();
        this.port = port;

        this.initializeMiddleware(morgan);
        this.initializeControllers(controllers);
        this.initializeErrorHandler();
    }

    public async listen() {
        await this.app.listen(this.port, () =>
            console.log('server started at port ' + this.port)
        );
    }

    private initializeMiddleware(morgan: express.RequestHandler) {
        this.app.use(cors());
        this.app.use(morgan);
        this.app.use(express.json());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(c => this.app.use(c.router));
    }

    private initializeErrorHandler() {
        this.app.use(errorMiddleware);
    }
}
