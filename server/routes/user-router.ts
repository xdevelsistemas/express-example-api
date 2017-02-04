import * as JSData from 'js-data'
import {UserController} from '../controllers/user-controller'
import { Routes, Config, Interfaces } from 'js-data-dao'
export class UserRouter extends Routes.PersistRouter<Interfaces.IBaseUser, UserController> {
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    let ctrl = new UserController(store, appConfig)
    super(store, ctrl)
  }
}
