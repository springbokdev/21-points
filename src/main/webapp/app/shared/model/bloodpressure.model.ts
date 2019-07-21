import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IBloodpressure {
  id?: number;
  systolic?: number;
  diastolic?: number;
  timestamp?: Moment;
  user?: IUser;
}

export class Bloodpressure implements IBloodpressure {
  constructor(public id?: number, public systolic?: number, public diastolic?: number, public timestamp?: Moment, public user?: IUser) {}
}
