import { useState } from 'react';
import { FaTrash, FaFilter, FaHeart } from 'react-icons/fa';

const sampleRecipes = [
    {
        id: 1,
        name: 'Spaghetti Bolognese',
        category: 'Italian',
        image: 'https://source.unsplash.com/400x300/?spaghetti',
    },
    {
        id: 2,
        name: 'Paneer Tikka',
        category: 'Indian',
        image: 'https://source.unsplash.com/400x300/?paneer',
    },
    {
        id: 3,
        name: 'Sushi Roll',
        category: 'Japanese',
        image: 'https://source.unsplash.com/400x300/?sushi',
    },
    {
        id: 4,
        name: 'Sushi Roll',
        category: 'Japanese',
        image: 'https://source.unsplash.com/400x300/?sushi',
    },
];

export default function Favorites() {
    const [favorites, setFavorites] = useState(sampleRecipes);
    const [filter, setFilter] = useState('');

    const removeFavorite = (id) => {
        setFavorites(favorites.filter(recipe => recipe.id !== id));
    };

    const filteredRecipes = favorites.filter(recipe =>
        recipe.category.toLowerCase().includes(filter.toLowerCase())
    );

    return (
      <div className="max-w-screen-xl mx-auto px-4  py-20">
  <div className="w-full">
    <div className="flex flex-wrap items-center justify-between mb-6 border-b-2 border-b-[rgba(0,0,0,0.2)] py-4">
      <h1 className="text-3xl font-bold flex items-center gap-x-2">
        <FaHeart className="text-red-600" />
        Favorite Recipes
      </h1>
      <FaFilter className="text-gray-500" size={24} />
    </div>


    {/* Optional filter input */}
    {/* <input
      type="text"
      placeholder="Filter by category..."
      className="mb-6 p-3 border rounded w-full max-w-md"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    /> */}

    <div className="grid grid-cols-1 pt-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredRecipes.map(recipe => (
        <div key={recipe.id} className="bg-white rounded shadow overflow-hidden">
          <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />
          <div className="p-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{recipe.name}</h2>
              <p className="text-sm text-gray-500">{recipe.category}</p>
            </div>
            <button
              onClick={() => removeFavorite(recipe.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

    );
}
