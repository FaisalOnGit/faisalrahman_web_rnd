const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const petugasRoutes = require("./routes/PetugasRoutes");
const gerbangRoutes = require("./routes/GerbangRoutes");
const kendaraanRoutes = require("./routes/KendaraanRoutes");
const transaksiRoutes = require("./routes/TransaksiRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/petugas", petugasRoutes);
app.use("/gerbang", gerbangRoutes);
app.use("/kendaraan", kendaraanRoutes);
app.use("/transaksi", transaksiRoutes);

// Koneksi ke MongoDB
mongoose
  .connect("mongodb://localhost:27017/parkirDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Jalankan server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${PORT}`)
);
