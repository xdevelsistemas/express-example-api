import { GroupController } from '../controllers/group-controller'
import { IGroup } from '../models/group'
import * as JSData from 'js-data'
import { Routes, Config } from 'js-data-dao'
export class GroupRouter extends Routes.PersistRouter<IGroup, GroupController> {
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    let ctrl = new GroupController(store, appConfig)
    super(store, ctrl)
  }
}
