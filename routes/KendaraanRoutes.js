const express = require("express");
const router = express.Router();
const Kendaraan = require("../models/Kendaraan");

// Tambah kendaraan
router.post("/", async (req, res) => {
  try {
    const newKendaraan = new Kendaraan(req.body);
    await newKendaraan.save();
    res.status(201).json(newKendaraan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ambil semua kendaraan
router.get("/", async (req, res) => {
  const kendaraan = await Kendaraan.find();
  res.json(kendaraan);
});

module.exports = router;
