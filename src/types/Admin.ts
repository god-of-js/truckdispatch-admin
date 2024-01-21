export default interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  type: 'super-admin' | 'support' | 'marketer';
  email: string;
  password: string;
}
