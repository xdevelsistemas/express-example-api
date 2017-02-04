import * as JSData from 'js-data'
import { UserController } from '../controllers'
import { Routes, Config } from 'js-data-dao'
import { IUser } from '@prodest/mapeandoes-typings'
export class UserRouter extends Routes.PersistRouter<IUser, UserController> {
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    let ctrl = new UserController(store, appConfig)
    super(store, ctrl)
  }
}
