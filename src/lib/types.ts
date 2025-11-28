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
  /** The createdAt timestamp as ISO string */
  sk: string;
}

export interface WordIndex extends WordBase {
  hk: 'word',
  /** The normalized word */
  sk: string;
}

