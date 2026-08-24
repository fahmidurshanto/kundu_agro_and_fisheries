export type Blog = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  videoUrl?: string;
  tags?: string[];
  createdAt: string;
};
