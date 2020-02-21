// Boiler Plate
const express = require("express");
const router = require("./users/userRouter");
const logger = require("./middleware/logger");

const server = express();
const port = 8080;

server.use(express.json());

//sub Router
server.use("/api/", router);
server.use(logger());

//404 MiddleWare
// server.use((req, res) => {
//   res.status(404).json({
//     message:
//       "Sorry, we couldn't find that! Here is a Gif to make you laugh for your troubles -> https://tinyurl.com/y7pgqmud "
//   });
// });

server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
