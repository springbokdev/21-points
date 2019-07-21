import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IWeight {
  id?: number;
  weight?: number;
  timestamp?: Moment;
  user?: IUser;
}

export class Weight implements IWeight {
  constructor(public id?: number, public weight?: number, public timestamp?: Moment, public user?: IUser) {}
}
