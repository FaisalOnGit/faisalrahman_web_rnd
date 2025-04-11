const mongoose = require("mongoose");
const short = require("short-uuid");
const translator = short("0123456789");

const gerbangSchema = new mongoose.Schema({
  GerbangID: {
    type: String,
    unique: true,
    required: true,
    default: () => translator.new().slice(0, 2),
  },
  NamaGerbang: {
    type: String,
    required: true,
  },
  TipeGerbang: {
    type: String,
    required: true,
    enum: ["Masuk", "Keluar"], // Hanya bisa "Masuk" atau "Keluar"
  },
});

module.exports = mongoose.model("Gerbang", gerbangSchema);
