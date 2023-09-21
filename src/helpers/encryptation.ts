import { compareSync, hashSync } from 'bcrypt';

export const encrypt = (str: string) => hashSync(str, 10);

export const compare = (str: string, encryptedStr: string) =>
  compareSync(str, encryptedStr);
