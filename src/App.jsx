import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/recipes');
      // Sort recipes by likes (descending) and then by creation date
      const sortedRecipes = response.data.sort((a, b) => 
        (b.likes || 0) - (a.likes || 0) || 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setRecipes(sortedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const addRecipe = async (newRecipe) => {
    try {
      const response = await axios.post('http://localhost:5000/recipes', newRecipe);
      setRecipes(prevRecipes => [...prevRecipes, response.data]);
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const likeRecipe = async (recipeId) => {
    try {
      await axios.post(`http://localhost:5000/recipes/${recipeId}/like`);
      fetchRecipes(); // Refresh the recipe list to show updated likes
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header>
          <nav className="app-nav">
            <Link to="/" className="home-button">🏠 Home</Link>
            <h1>Recipe-Vault</h1>
            <div className="nav-links">
              <SearchBar setSearch={setSearch} />
              <Link to="/add-recipe" className="add-recipe-button">Add Recipe</Link>
            </div>
          </nav>
        </header>
        <main className="app-content">
          <Routes>
            <Route 
              path="/" 
              element={<RecipeList recipes={recipes} search={search} onLike={likeRecipe} />} 
            />
            <Route 
              path="/add-recipe" 
              element={<RecipeForm onAddRecipe={addRecipe} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;