import { Controllers } from 'js-data-dao/lib/'
import { DistrictDAO } from '../models/district'
import { IDistrict } from '@prodest/mapeandoes-typings'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'

export class DistrictController extends Controllers.BasePersistController<IDistrict> {
  public constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    super(new DistrictDAO(store, appConfig))
  }
}
