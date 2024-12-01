const express = require("express");
const mongoose = require("mongoose");
const mysql = require("mysql2/promise");
const cors = require("cors");
const https = require("https");
const http = require("http");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Importeer routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profiles");
const subscriptionRoutes = require("./routes/subscriptions");
const customerRoutes = require("./routes/customers");

// Express-app maken
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Gebruik routes
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/customers", customerRoutes);

// HTTP naar HTTPS omleiding (alleen productie)
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.protocol === "http") {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    } else {
      next();
    }
  });
}

// Basisroute
app.get("/", (req, res) => {
  res.send("API is live");
});

// Functie om SSL-certificaten te laden
function loadSSLOptions() {
  const sslKeyPath = process.env.SSL_KEY_PATH;
  const sslCertPath = process.env.SSL_CERT_PATH;

  if (!sslKeyPath || !sslCertPath) {
    console.warn(
      "SSL-certificaatpaden zijn niet ingesteld in .env. HTTPS wordt niet geactiveerd."
    );
    return null;
  }

  if (!fs.existsSync(sslKeyPath) || !fs.existsSync(sslCertPath)) {
    console.error("SSL-certificaatbestanden niet gevonden:");
    console.error(`  SSL_KEY_PATH: ${sslKeyPath}`);
    console.error(`  SSL_CERT_PATH: ${sslCertPath}`);
    return null;
  }

  return {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath),
  };
}

// Hoofdfunctie
async function startServer() {
  try {
    // Verbinden met MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Verbonden met MongoDB");

    // Verbinden met MySQL
    const mysqlConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    console.log("Verbonden met MySQL");
    app.locals.mysqlConnection = mysqlConnection;

    // HTTPS-server starten als certificaten beschikbaar zijn
    const sslOptions = loadSSLOptions();
    const PORT = process.env.PORT || 5000;

    if (sslOptions) {
      https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`Secure server draait op https://localhost:${PORT}`);
      });
    } else {
      http.createServer(app).listen(PORT, () => {
        console.log(`Onsecure server draait op http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error("Fout bij het starten van de server:", err.message);
    process.exit(1);
  }
}

startServer();
