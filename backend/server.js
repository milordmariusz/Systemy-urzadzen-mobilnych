const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importuj cors

const app = express();
const PORT = process.env.PORT || 3000;

// Połączenie z bazą danych MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/pwm-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Błąd połączenia z MongoDB:"));
db.once("open", () => {
  console.log("Połączono z bazą danych MongoDB.");
});

// Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

app.use(bodyParser.json());
app.use(cors()); // Dodaj middleware cors

// Dodaj nowego użytkownika
app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik już istnieje." });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "Utworzono nowego użytkownika." });
  } catch (error) {
    console.error("Błąd podczas tworzenia użytkownika:", error);
    res
      .status(500)
      .json({ message: "Wystąpił błąd podczas tworzenia użytkownika." });
  }
});

// Handle GET requests to the root URL
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Start serwera
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}.`);
});
