import { hashSync } from 'bcrypt';

export const encrypt = (str: string) => hashSync(str, 10);
