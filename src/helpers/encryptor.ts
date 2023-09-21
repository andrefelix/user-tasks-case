import { compareSync, hashSync } from 'bcrypt';

const HASH_SALT = 10;
export class Encryptor {
  public static hashSync(phrase: string): string {
    return hashSync(phrase, HASH_SALT);
  }

  public static compareSync(phrase: string, encryptedPhrase: string): boolean {
    return compareSync(phrase, encryptedPhrase);
  }
}
