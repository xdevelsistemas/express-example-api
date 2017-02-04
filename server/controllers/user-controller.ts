import { Controllers } from 'js-data-dao/lib/'
import { UserDAO } from '../models/user'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'

export class UserController extends Controllers.BasePersistController<ISource> {
  public constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    super(new UserDAO(store, appConfig))
  }
}
