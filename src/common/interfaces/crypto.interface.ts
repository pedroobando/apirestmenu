export interface CryptoAdapter {
  hash(password: string): string;
  compare(password: string, hash: string): boolean;
}
