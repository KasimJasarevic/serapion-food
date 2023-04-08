export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  photo?: string;
  email: string;
  lastOrder?: Date;
  subscriptionId?: string;
}