import { Injectable }     from '@angular/core';
import { GUID } from './utils';


@Injectable()
export class InitiatorService
{
  iid : String = GUID.newGuid();

  getIID() : String
  {
    return this.iid;
  }
}
