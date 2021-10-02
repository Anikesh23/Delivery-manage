import express from "express";
import * as core from "express-serve-static-core";
import {SocketConfig} from "./Socket.config";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import {myServer} from "../server";
import { SocketHandlerService } from "../services/socketHandler.service";
const headerConfig = require('../header.config');

// ROUTES IMPORTS
const authRoutes = require('../api/routes/auth');
const deliverRoutes = require('../api/routes/deliver');
const socketRoutes = require('../api/routes/socket');

export class ServerConfig {
    app: core.Application = express();

    init = () => {
        SocketConfig.initSocket(myServer);
        SocketHandlerService.connectSocket();
        this.connectMongoose();
        this.setBodyParser();
        // TODO
        // this.setCorsHeader();
        this.setRoutes();
        this.setErrorHandler();
    }
    // MONGOOSE DB CONNECTION
    private connectMongoose = () => {
        mongoose.connect('mongodb+srv://WishTest:' + process.env.MONGO_ATLAS_PW + '@cluster0.dcqna.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then();
    }

    // BODY PARSER
    private setBodyParser = () => {
        this.app.use(morgan('dev'));
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(express.json());
    }

    // HEADER CONFIGURATION
    private setCorsHeader = () => {
        this.app.use(cors(headerConfig));

    }

    // ROUTES
    private setRoutes = () => {
        this.app.use('/users', authRoutes);
        this.app.use('/deliver', deliverRoutes);
        this.app.use('/socket', socketRoutes);
    }

    //ERROR HANDLER
    private setErrorHandler() {
        this.app.use((req, res, next) => {
            const error = new Error('Not found');
            res.status(404);
            next(error);
        });
        this.app.use((error: any, req: any, res: any, next: any) => {
            res.status(error.status || 500);
            res.json({
                error: {
                    message: error.message || 'Internal server error'
                }
            });
        });
    }
}
