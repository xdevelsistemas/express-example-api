import { GroupDAO, IGroup } from '../models/group'
import { Controllers } from 'js-data-dao/lib/'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'

export class GroupController extends Controllers.BasePersistController<IGroup> {
  public constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    super(new GroupDAO(store, appConfig))
  }
}
