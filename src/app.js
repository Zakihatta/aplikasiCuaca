require("dotenv").config();

const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { error } = require("console");

const geocode = require("./utils/geocode");
const forecast = require("./utils/prediksiCuaca");

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//Mendefinisikan path untuk konfigurasi express
const direktoriPublic = path.join(__dirname, "../public");
const direktoriViews = path.join(__dirname, "../templates/views");
const direktoriPartials = path.join(__dirname, "../templates/partials");

//Setup handlebars engine dan lokasi folder views
app.set("view engine", "hbs");
app.set("views", direktoriViews);
hbs.registerPartials(direktoriPartials);

//Setup direktori statis
app.use(express.static(direktoriPublic));

//Main page
app.get("", (req, res) => {
  res.render("index", {
    judul: "Aplikasi Cek Cuaca",
    nama: "Zaki Hatta",
  });
});

//FAQ page
app.get("/bantuan", (req, res) => {
  res.render("bantuan", {
    judul: "Halaman bantuan",
    nama: "Zaki hatta",
    teksBantuan: "ini adalah teks bantuan",
  });
});

//infoCuaca page
app.get("/infoCuaca", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Kamu harus memasukkan lokasi yang ingin dicari",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, dataPrediksi) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          prediksiCuaca: dataPrediksi,
          lokasi: location,
          address: req.query.address,
        });
      });
    }
  );
});

//About page
app.get("/about", (req, res) => {
  res.render("about", {
    judul: "About me",
    nama: "Zaki Hatta",
  });
});

app.get("/bantuan/*", (req, res) => {
  res.render("404", {
    judul: "404",
    nama: "Zaki Hatta",
    pesanKesalahan: "Artikel yang dicari tidak ditemukan.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    judul: "404",
    nama: "Zaki Hatta",
    pesanKesalahan: "Halaman tidak ditemukan.",
  });
});

module.exports = app;
