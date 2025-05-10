import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RecipeForm.css';

const RecipeForm = ({ onAddRecipe }) => {
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    instructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const recipe = {
      name: formData.name,
      ingredients: formData.ingredients.split(',').map(ingredient => ingredient.trim()),
      instructions: formData.instructions
    };

    try {
      const response = await axios.post('http://localhost:5000/recipes', recipe);
      onAddRecipe(response.data);
      navigate('/');
    } catch (error) {
      console.error('Error adding recipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="recipe-form-container">
      <div className="form-header">
        <h2>Create New Recipe</h2>
        <p>Share your culinary masterpiece with the world</p>
      </div>
      
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label htmlFor="name">Recipe Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Creamy Garlic Pasta"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          <input
            id="ingredients"
            name="ingredients"
            type="text"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="Comma separated list (e.g. pasta, garlic, cream)"
            required
          />
          <small className="hint">Separate ingredients with commas</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows="6"
            placeholder="Step-by-step instructions..."
            required
          />
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Recipe...' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;