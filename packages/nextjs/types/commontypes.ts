export interface User {
  name: string;
  address: string;
  image?: string;
  github?: string;
  portfolio?: string;
  buidlguidl?: string;
  twitter?: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  self_rating: number;
  peer_rating: number;
  proof_of_work: string[];
  verifiers: string[];
}
