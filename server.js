const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/recipe-manager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Recipe Model
const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  instructions: String,
  isFavorite: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model("Recipe", recipeSchema);

// Routes
app.get("/recipes", async (req, res) => {
  try {
    const sortBy = req.query.sort || '-createdAt'; // Default sort by newest first
    const recipes = await Recipe.find().sort(sortBy);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/recipes", async (req, res) => {
  const recipe = new Recipe(req.body);
  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/recipes/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/recipes/:id", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/recipes/:id/favorite", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    recipe.isFavorite = !recipe.isFavorite;
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// New like endpoint
app.put("/recipes/:id/like", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});