import bcrypt from 'bcryptjs';

const passwordCompare = (passwordToTest, passwordHash) =>
  bcrypt.compareSync(passwordToTest, passwordHash);

export default passwordCompare;
