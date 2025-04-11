const express = require("express");
const router = express.Router();
const TransaksiParkir = require("../models/Transaksi");
const Kendaraan = require("../models/Kendaraan");
const shortUUID = require("short-uuid");

router.post("/masuk", async (req, res) => {
  try {
    const { KendaraanID, PetugasID, GerbangID, TarifPerjam } = req.body;

    // Cek apakah kendaraan sudah ada dalam transaksi aktif
    const existingTransaction = await TransaksiParkir.findOne({
      KendaraanID,
      WaktuKeluar: null,
    });
    if (existingTransaction) {
      return res
        .status(400)
        .json({ error: "Kendaraan sudah masuk dan belum keluar." });
    }

    const newTransaction = new TransaksiParkir({
      TransaksiID: shortUUID.generate(),
      KendaraanID,
      PetugasID,
      GerbangID,
      TarifPerjam,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/keluar/:platNomor", async (req, res) => {
  try {
    const { platNomor } = req.params;
    const kendaraan = await Kendaraan.findOne({ PlatNomor: platNomor });

    if (!kendaraan) {
      return res.status(404).json({ error: "Kendaraan tidak ditemukan." });
    }

    // Cari transaksi aktif berdasarkan kendaraan
    const transaksi = await TransaksiParkir.findOne({
      KendaraanID: kendaraan.KendaraanID,
      WaktuKeluar: null,
    });

    if (!transaksi) {
      return res
        .status(404)
        .json({ error: "Tidak ada transaksi aktif untuk kendaraan ini." });
    }

    // Hitung durasi & biaya parkir
    const waktuKeluar = new Date();
    const durasiJam = Math.ceil(
      (waktuKeluar - transaksi.WaktuMasuk) / (1000 * 60 * 60)
    ); // Hitung dalam jam
    const totalBayar = durasiJam * transaksi.TarifPerjam;
    const keuntungan = totalBayar * (transaksi.MarginKeuntungan || 0.1); // Default margin 10%

    // Update transaksi
    transaksi.WaktuKeluar = waktuKeluar;
    transaksi.DurasiParkir = durasiJam;
    transaksi.TotalBayar = totalBayar;
    transaksi.Keuntungan = keuntungan;

    await transaksi.save();
    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 3. Ambil daftar kendaraan yang masih parkir
router.get("/aktif", async (req, res) => {
  try {
    const transaksiAktif = await TransaksiParkir.find({
      WaktuKeluar: null,
    }).populate("KendaraanID");
    res.json(transaksiAktif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 4. Laporan keuntungan parkir
router.get("/report", async (req, res) => {
  try {
    const laporan = await TransaksiParkir.aggregate([
      { $match: { Keuntungan: { $exists: true } } },
      {
        $group: {
          _id: null,
          totalPendapatan: { $sum: "$TotalBayar" },
          totalKeuntungan: { $sum: "$Keuntungan" },
        },
      },
    ]);
    res.json(laporan[0] || { totalPendapatan: 0, totalKeuntungan: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
