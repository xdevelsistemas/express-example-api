import { Controllers } from 'js-data-dao/lib/'
import { SourceDAO } from '../models/source'
import { ISource } from '@prodest/mapeandoes-typings'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'

export class SourceController extends Controllers.BasePersistController<ISource> {
  public constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    super(new SourceDAO(store, appConfig))
  }
}
