const PORT = 3000;
const os = require("os");
const cors = require("cors");
const express = require('express');
const cluster = require("cluster");
const { connectDb } = require("./utils/database");
const { rateLimit } = require("express-rate-limit");

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const basketRoutes = require('./routes/basketRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
require("dotenv").config();

app.use(
  cors()
)
app.use(express.json());

connectDb();

const limiter = rateLimit({
  limit: 100,
  headers: true,
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/baskets", basketRoutes);
app.use("/products", productRoutes);

app.use('/,', limiter);

if (cluster.isMaster) {
  const CPUs = os.cpus().length;
  for (let i = 0; i < CPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(PORT, () => {
    console.log(`worker process ${process.pid} is listening on port 3000`);
  });
}