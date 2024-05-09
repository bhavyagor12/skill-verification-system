export interface User {
  address: string;
  name: string;
  image?: string;
  github?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  linkedin?: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  self_rating: number;
  peer_rating: number;
  proof_of_work: string[];
  verifiers: string[];
}
