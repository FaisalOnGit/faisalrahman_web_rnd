const mongoose = require("mongoose");
const short = require("short-uuid");
const translator = short("0123456789");

const PetugasSchema = new mongoose.Schema({
  PetugasID: {
    type: String,
    default: () => shortUUID.generate(),
    unique: true,
  },
  NamaPetugas: { type: String, required: true },
  Shift: { type: String, enum: ["pagi", "siang", "malam"], required: true },
});

module.exports = mongoose.model("Petugas", PetugasSchema);
