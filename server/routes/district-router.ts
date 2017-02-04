import * as JSData from 'js-data'
import { DistrictController } from '../controllers'
import { Routes, Config } from 'js-data-dao'
import { IDistrict } from '@prodest/mapeandoes-typings'
export class DistrictRouter extends Routes.PersistRouter<IDistrict, DistrictController> {
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    let ctrl = new DistrictController(store, appConfig)
    super(store, ctrl)
  }
}
