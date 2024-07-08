const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");
const clientRoutes = require("./Routes/clientRoutes");
const warehouseRoutes = require("./Routes/warehouseRoutes");
const emailRoutes = require("./Routes/emailRoute");
const cashierRoutes = require("./Routes/cashierRoutes");
const https = require("https");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://hexlertech:vQEmfMxnymZ510vo@cluster0.gyfkxge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: "*",
  })
);

// Use auth routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/clients", clientRoutes);
app.use("/warehouses", warehouseRoutes);
app.use("/email", emailRoutes);
app.use("/cashiers", cashierRoutes);

// SSL options
const options = {
  key: fs.readFileSync('../server.key'),
  cert: fs.readFileSync('../server.crt')
};

// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on port ${PORT}`);
});
