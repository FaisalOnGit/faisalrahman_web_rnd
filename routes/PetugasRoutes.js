const express = require("express");
const router = express.Router();
const Petugas = require("../models/Petugas");

// Tambah petugas
router.post("/", async (req, res) => {
  try {
    const newPetugas = new Petugas(req.body);
    await newPetugas.save();
    res.status(201).json(newPetugas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ambil semua petugas
router.get("/", async (req, res) => {
  const petugas = await Petugas.find();
  res.json(petugas);
});

module.exports = router;
