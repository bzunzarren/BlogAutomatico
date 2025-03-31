import React, { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';
import { supabase } from './lib/supabase';
import { NewsCard } from './components/NewsCard';
import { motion } from 'framer-motion';
import type { NewsArticle } from './types/news';

function AdvertisementCard() {
  return (
    <div className="bg-yellow-100 p-4 rounded-md shadow-md text-center">
      <h3 className="text-lg font-bold text-yellow-700">Publicidade</h3>
      <p className="text-gray-600">Anuncie aqui e alcance milhares de leitores!</p>
      <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
        Saiba mais
      </button>
    </div>
  );
}

function App() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'world', 'business', 'technology', 'sports', 'science', 'entertainment'];

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('news_articles')
          .select('*')
          .order('publishedat', { ascending: false })
          .limit(10);

        if (selectedCategory !== 'all') {
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;

        if (error) throw error;
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Newspaper className="w-10 h-10 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Hora News</h1>
          </div>
          <div className="relative">
            <label htmlFor="category-filter" className="sr-only">Escolha uma categoria</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-gray-700 focus:ring focus:ring-indigo-300 transition"
              aria-label="Selecione uma categoria de notícias"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center flex-col">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-700">Carregando notícias...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-center">
            <p className="text-red-700">{error}</p>
          </div>
        ) : articles.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            {articles.map((article, index) => (
              <React.Fragment key={article.id}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <NewsCard article={article} />
                </motion.div>
                {index % 3 === 2 && <AdvertisementCard />}
              </React.Fragment>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-600 text-lg">Nenhuma notícia encontrada para essa categoria.</p>
        )}
      </main>
    </div>
  );
}

export default App;
