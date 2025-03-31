export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageurl: string | null;
  category: string;
  publishedat: string;
  source: string;
  created_at: string;
}