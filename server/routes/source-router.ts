import * as JSData from 'js-data'
import { SourceController } from '../controllers'
import { Routes, Config } from 'js-data-dao'
import { ISource } from '@prodest/mapeandoes-typings'
export class SourceRouter extends Routes.PersistRouter<ISource, SourceController> {
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    let ctrl = new SourceController(store, appConfig)
    super(store, ctrl)
  }
}
