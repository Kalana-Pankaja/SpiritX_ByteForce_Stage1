console.log("Starting server...");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, minlength: 8 },
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Signup request received:", req.body); 

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already taken" });

        if (username.length < 8) {
            return res.status(400).json({ message: "Username must be at least 8 characters long" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must contain at least one lowercase letter, one uppercase letter, and one special character"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        res.json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
