export type Article = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  summary?: string;
};

export type NewsResponse = {
  source: string;
  articles: Article[];
};
