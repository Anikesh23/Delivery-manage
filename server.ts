import {ServerConfig} from "./classes/server.config";

const http = require('http');
const serverConfig = new ServerConfig();
const app = serverConfig.app;

const port = process.env.PORT || 3000;
export const myServer = app.listen(port, () => {
    serverConfig.init();
});
