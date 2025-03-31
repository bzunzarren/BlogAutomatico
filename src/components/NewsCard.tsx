import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { NewsArticle } from '../types/news';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {article.imageurl && (
        <img
          src={article.imageurl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-indigo-600">
            {article.category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(article.publishedat), 'MMM d, yyyy')}
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
        <p className="text-gray-600 mb-4">{article.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Source: {article.source}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            Read more
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}