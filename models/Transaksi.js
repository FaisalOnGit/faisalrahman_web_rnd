const mongoose = require("mongoose");
const shortUUID = require("short-uuid");

const TransaksiParkirSchema = new mongoose.Schema({
  TransaksiID: {
    type: String,
    required: true,
    unique: true,
    default: () => shortUUID.generate(),
  },
  KendaraanID: { type: String },
  PetugasID: { type: String, required: true, ref: "Petugas" },
  GerbangID: { type: String, required: true, ref: "Gerbang" },
  WaktuMasuk: { type: Date, required: true, default: Date.now },
  WaktuKeluar: { type: Date },
  DurasiParkir: { type: Number },
  TarifPerjam: { type: Number },
  TotalBayar: { type: Number },
  MarginKeuntungan: { type: Number },
  Keuntungan: { type: Number },
});

module.exports = mongoose.model("TransaksiParkir", TransaksiParkirSchema);
