import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import cron from 'node-cron';

// Configurar diretório e carregar variáveis de ambiente
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

if (!supabaseUrl || !supabaseKey || !SERPAPI_KEY) {
  throw new Error('Faltam variáveis de ambiente no arquivo .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de categorias para buscar no Google Notícias
const NEWS_CATEGORIES = ['world', 'business', 'technology', 'sports', 'science', 'entertainment'];

// 🔍 Função para buscar notícias do Google News com limite de 20 notícias
async function fetchGoogleNews(category) {
  const url = `https://serpapi.com/search.json?engine=google_news&q=${category}&hl=pt&gl=BR&num=20&api_key=${SERPAPI_KEY}`;

  try {
    const response = await axios.get(url);

    if (!response.data.news_results || response.data.news_results.length === 0) {
      console.error(`❌ Nenhuma notícia encontrada para a categoria: ${category}`);
      return [];
    }

    // Limita a 20 notícias e remove as que não possuem URL válida
    const articles = response.data.news_results
      .slice(0, 10)
      .filter(article => article.link) // 🔍 Filtra apenas as notícias com `url`
      .map((article) => ({
        title: article.title,
        description: article.snippet || 'Sem descrição disponível',
        url: article.link, // Já garantimos que `url` não será `null`
        imageurl: article.thumbnail || null,
        category,
        publishedat: new Date().toISOString(),
        source: article.source ? article.source.name : 'Google News'
      }));

    console.log(`✅ Obtidas ${articles.length} notícias válidas para ${category}`);
    return articles;
  } catch (error) {
    console.error(`❌ Erro ao buscar notícias de ${category}:`, error.message);
    return [];
  }
}

// 📌 Função para inserir notícias no banco
async function insertNews(articles) {
  for (const article of articles) {
    // Verifica novamente se a `url` está presente (por segurança extra)
    if (!article.url) {
      console.warn(`⚠️ Notícia ignorada por não ter URL: ${article.title}`);
      continue;
    }

    // Verificar se a notícia já existe antes de inserir
    const { data: existingNews, error: fetchError } = await supabase
      .from('news_articles')
      .select('id')
      .eq('url', article.url)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar existência da notícia:', fetchError);
      continue;
    }

    if (!existingNews) {
      // Inserir a notícia apenas se ainda não existir
      const { error: insertError } = await supabase.from('news_articles').insert([article]);

      if (insertError) {
        console.error(`❌ Erro ao inserir notícia (${article.title}):`, insertError.message);
      } else {
        console.log(`✅ Notícia inserida: ${article.title}`);
      }
    } else {
      console.log(`🔄 Notícia já existe no banco: ${article.title}`);
    }
  }
}

// 🔄 Função principal para buscar e salvar notícias
async function main() {
  console.log('🔍 Buscando notícias do Google News de hoje...');

  for (const category of NEWS_CATEGORIES) {
    console.log(`📡 Buscando notícias da categoria: ${category}...`);
    const articles = await fetchGoogleNews(category);

    if (articles.length > 0) {
      await insertNews(articles);
    }
  }

  console.log('🎉 Atualização das notícias concluída!');
}

// 🔄 Agendar a execução todos os dias às 6:00 da manhã
cron.schedule('0 6 * * *', async () => {
  console.log('⏳ Buscando notícias automaticamente...');
  await main();
});

console.log('✅ Agendador de notícias iniciado! Ele rodará todos os dias às 6:00 da manhã.');


main(); // Executar imediatamente ao iniciar o script


//deve baixar e rodar : PS C:\Users\Romulo-03\Downloads\blog> node --experimental-modules ./scripts/fetchNews.js

//npm install axios @supabase/supabase-js dotenv node-cron}
//node --experimental-modules ./scripts/fetchNews.js
