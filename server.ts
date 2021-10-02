// const http = require('http');
// const serverConfig = new ServerConfig();
// const app = serverConfig.app;

// const port = process.env.PORT || 3000;
// export const myServer = app.listen(port, () => {
//     serverConfig.init();
// });
const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;

app.get('/', (req: any, res: any) => {
  res.send('hello world!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})