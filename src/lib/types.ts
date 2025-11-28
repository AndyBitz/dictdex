export interface User {
  hk: `user#${string}`;
  sk: string;
  username: string;
  hashedPassword: string;
  updatedAt: number;
  createdAt: number;
}

export interface WordBase {
  word: string;
  normalizedWord: string;
  description: string;
  types: string[];
  examples: string[];
  language: string;
  informal: boolean;
  updatedAt: number;
  createdAt: number;
}

export interface Word extends WordBase {
  hk: 'wordList';
  sk: string; // createdAt timestamp as ISO string
}

export interface WordIndex extends WordBase {
  hk: 'word',
  sk: string; // normalizedWord
}

