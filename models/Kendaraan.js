const mongoose = require("mongoose");
const shortid = require("short-uuid");

const KendaraanSchema = new mongoose.Schema({
  KendaraanID: {
    type: String,
    default: () => shortid.generate().slice(0, 6),
    unique: true,
  },
  PlatNomor: { type: String, required: true, unique: true },
  JenisKendaraan: { type: String, enum: ["Mobil", "Motor"], required: true },
  TipeKendaraan: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const tipeKendaraanOptions = {
          Mobil: ["Truk", "Bus", "Minibus", "SUV", "Sedan", "Pickup"],
          Motor: ["Moge/Sport", "Bebek/Matic"],
        };
        return tipeKendaraanOptions[this.JenisKendaraan]?.includes(value);
      },
      message: "Tipe kendaraan tidak valid untuk jenis kendaraan yang dipilih.",
    },
  },
});

module.exports = mongoose.model("Kendaraan", KendaraanSchema);
