const express = require("express");
const router = express.Router();
const Gerbang = require("../models/Gerbang");

router.post("/", async (req, res) => {
  try {
    const newGerbang = new Gerbang(req.body);
    await newGerbang.save();
    res.status(201).json(newGerbang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const gerbang = await Gerbang.find();
  res.json(gerbang);
});

module.exports = router;
