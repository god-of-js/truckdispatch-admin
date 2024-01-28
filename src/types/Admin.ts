export default interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  role: 'super-admin' | 'support' | 'marketer';
  email: string;
  password: string;
}
