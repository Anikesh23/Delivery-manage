// const http = require('http');
// const serverConfig = new ServerConfig();
// const app = serverConfig.app;

// const port = process.env.PORT || 3000;
// export const myServer = app.listen(port, () => {
//     serverConfig.init();
// });
const http = require('http');

http.createServer(function (req: any, res: any) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  console.log('node done');
  res.end('Hello World!');
}).listen(8080);