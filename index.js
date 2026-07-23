const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json()); // Sunucunun JSON formatındaki verileri anlamasını sağlar

app.get('/kitaplar', async (req, res) => {
  try {
    const sonuc = await pool.query('SELECT * FROM kitaplar ORDER BY id ASC');
    res.json(sonuc.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});


app.post('/kitaplar', async (req, res) => {
  try {
    // Postman'den (dış dünyadan) gelen verileri yakalıyoruz
    const { baslik, yazar, okundu_mu } = req.body;

    // Veritabanına yeni satır ekleyen SQL sorgumuz
    const yeniKitap = await pool.query(
      'INSERT INTO kitaplar (baslik, yazar, okundu_mu) VALUES ($1, $2, $3) RETURNING *',
      [baslik, yazar, okundu_mu || false]
    );

    // Eklenen yeni kitabı yanıt olarak geri dönüyoruz
    res.json(yeniKitap.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

app.put('/kitaplar/:id', async (req, res) => {
  try {
    const { id } = req.params; // URL'den gelen id numarasını alıyoruz (Örn: /kitaplar/3)
    const { okundu_mu } = req.body; // Postman'den gelen yeni okundu durumunu alıyoruz

    const guncelKitap = await pool.query(
      'UPDATE kitaplar SET okundu_mu = $1 WHERE id = $2 RETURNING *',
      [okundu_mu, id]
    );

    if (guncelKitap.rows.length === 0) {
      return res.status(404).json({ mesaj: 'Kitap bulunamadı!' });
    }

    res.json(guncelKitap.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

app.delete('/kitaplar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const silinenKitap = await pool.query(
      'DELETE FROM kitaplar WHERE id = $1 RETURNING *',
      [id]
    );

    if (silinenKitap.rows.length === 0) {
      return res.status(404).json({ mesaj: 'Silinecek kitap bulunamadı!' });
    }

    res.json({ mesaj: 'Kitap başarıyla silindi!', silinen: silinenKitap.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu Hatası');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda tıkır tıkır çalışıyor... 🚀`);
});