import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaTrash, FaEdit, FaUtensils } from 'react-icons/fa';
import './RecipeList.css';

const RecipeList = ({ recipes, search }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`http://localhost:5000/recipes/${id}`);
        alert('Recipe deleted successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe');
      }
    }
  };

  const handleFavorite = async (id) => {
    try {
      await axios.put(`http://localhost:5000/recipes/${id}/favorite`);
      // Don't reload the page - consider using state management instead
      window.location.reload();
    } catch (error) {
      console.error('Error updating favorite:', error);
      alert('Failed to update favorite status');
    }
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="recipe-list-container">
      <div className="recipe-list-header">
        <h2>Your Recipe Collection</h2>
        <p>{filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found</p>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <div className="card-header">
                <h3 className="recipe-name">
                  <FaUtensils className="recipe-icon" /> {recipe.name}
                </h3>
                <button 
                  onClick={() => handleFavorite(recipe._id)} 
                  className={`favorite-btn ${recipe.isFavorite ? 'active' : ''}`}
                  aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {recipe.isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
              
              <div className="ingredients-preview">
                <h4>Ingredients:</h4>
                <ul>
                  {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <li className="more-items">+{recipe.ingredients.length - 3} more</li>
                  )}
                </ul>
              </div>

              <div className="card-actions">
                <Link to={`/edit/${recipe._id}`} className="edit-btn">
                  <FaEdit /> Edit
                </Link>
                <button 
                  onClick={() => handleDelete(recipe._id)} 
                  className="delete-btn"
                  aria-label="Delete recipe"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-recipes">
          <img src="/empty-state.svg" alt="No recipes found" className="empty-state-img" />
          <p>No recipes match your search. Try a different term or add a new recipe!</p>
          <Link to="/add" className="add-recipe-btn">Add New Recipe</Link>
        </div>
      )}
    </div>
  );
};

export default RecipeList;