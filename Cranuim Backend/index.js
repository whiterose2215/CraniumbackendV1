const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Load config
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

// Express setup
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    skins: [String]
});

const User = mongoose.model("User", userSchema);

// Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

// API Endpoints
app.get("/", (req, res) => res.send("Cranium Backend Running!"));

// Account creation
app.post("/createaccount", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    const newUser = new User({ username, password, skins: [] });
    await newUser.save();

    res.json({ message: "Account created successfully", username });
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.password !== password) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
});

// Add all skins
app.post("/addskins", authenticate, async (req, res) => {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) return res.status(404).json({ error: "User not found" });

    const allSkins = ["Renegade Raider", "Ghoul Trooper", "Black Knight"];
    user.skins = allSkins;
    await user.save();

    res.json({ message: "All skins added!", skins: user.skins });
});

// Start backend
const PORT = config.settings.backend_port || 3000;
app.listen(PORT, () => console.log(`🚀 Cranium backend running on port ${PORT}`));
