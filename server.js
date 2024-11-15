const PORT = 3000;
const app = express();
const os = require("os");
const cors = require("cors");
const express = require('express');
const cluster = require("cluster");
const userRoutes = require('./routes/userRoutes');
const { rateLimit } = require("express-rate-limit");
const { connectToDb } = require("./utils/database");

require("dotenv").config();

app.use(
  cors({
    origin: `http://localhost:${PORT}`
  })
)
app.use(express.json());

connectToDb();

const limiter = rateLimit({
  limit: 100,
  headers: true,
});


app.use('/api/users', userRoutes);


app.use(limiter);

if (cluster.isMaster) {
  const CPUs = os.cpus().length;
  for (let i = 0; i < CPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(port, () => {
    console.log(`worker process ${process.pid} is listening on port 3000`);
  });
}