'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);

  const generateRecipes = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecipes('');

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes);
      setSelectedRecipe(null);
    } catch (err) {
      setError('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Split recipes into two parts when they exist
  const [recipe1, recipe2] = recipes
    ? recipes.split('Recipe Option 2:').map((recipe, index) => 
        index === 0 ? recipe.replace('Recipe Option 1:', '').trim() : recipe.trim()
      )
    : ['', ''];

  const handleCardClick = (index: number) => {
    setSelectedRecipe(index);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-recipe-dark via-gray-900 to-recipe-dark py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto"
      >
        <h1 className="text-7xl font-black text-center mb-12 animate-gradient bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500 bg-clip-text text-transparent tracking-tight">
          AI Recipe Generator
        </h1>
        
        <motion.form 
          onSubmit={generateRecipes} 
          className="max-w-2xl mx-auto mb-16 glass-morphism rounded-3xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-8">
            <label 
              htmlFor="ingredients" 
              className="block text-2xl mb-3 bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent font-bold"
            >
              Enter your ingredients
            </label>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="relative w-full p-6 rounded-2xl bg-recipe-card border-2 border-white/10 input-glow text-lg placeholder:text-gray-500 resize-none"
                rows={4}
                placeholder="e.g., chicken, rice, tomatoes, onions"
                required
              />
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={loading}
            className="relative w-full group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl text-white font-bold text-lg button-glow flex items-center justify-center">
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Crafting Your Recipes...
                </span>
              ) : 'Generate Recipes'}
            </div>
          </motion.button>
        </motion.form>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-red-500 bg-red-900/20 p-6 rounded-2xl mb-12 glass-morphism border-red-500/20"
          >
            {error}
          </motion.div>
        )}

        {recipes && (
          <motion.div 
            className={`grid ${selectedRecipe === null ? 'grid-cols-2' : 'grid-cols-1'} gap-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {selectedRecipe === null && (
              <>
                <motion.div 
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleCardClick(0)}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/50 to-yellow-400/50 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative recipe-card p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-4xl font-extrabold mb-4 animate-gradient bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                      Recipe Option 1
                    </h2>
                    <div className="prose prose-lg prose-invert prose-yellow prose-headings:text-yellow-400 prose-strong:text-yellow-300 max-w-none">
                      <div className="whitespace-pre-wrap">{recipe1}</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleCardClick(1)}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600/50 to-red-400/50 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative recipe-card p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-4xl font-extrabold mb-4 animate-gradient bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                      Recipe Option 2
                    </h2>
                    <div className="prose prose-lg prose-invert prose-red prose-headings:text-red-400 prose-strong:text-red-300 max-w-none">
                      <div className="whitespace-pre-wrap">{recipe2}</div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {selectedRecipe === 0 && (
              <motion.div 
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedRecipe(null)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/50 to-yellow-400/50 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative recipe-card p-8 rounded-3xl shadow-2xl">
                  <h2 className="text-4xl font-extrabold mb-4 animate-gradient bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Recipe Option 1
                  </h2>
                  <div className="prose prose-lg prose-invert prose-yellow prose-headings:text-yellow-400 prose-strong:text-yellow-300 max-w-none">
                    <div className="whitespace-pre-wrap">{recipe1}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedRecipe === 1 && (
              <motion.div 
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedRecipe(null)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600/50 to-red-400/50 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative recipe-card p-8 rounded-3xl shadow-2xl">
                  <h2 className="text-4xl font-extrabold mb-4 animate-gradient bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    Recipe Option 2
                  </h2>
                  <div className="prose prose-lg prose-invert prose-red prose-headings:text-red-400 prose-strong:text-red-300 max-w-none">
                    <div className="whitespace-pre-wrap">{recipe2}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
