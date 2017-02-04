
/**
 * busca as variaveis de ambiente no arquivo .env
 */
import * as dotenv from 'dotenv'
dotenv.config()
import { Config, Application } from 'js-data-dao'

/**
 * importacao das rotas
 */
import * as routes from './routes'

class MainApp extends Application {
  constructor() {
    let cfg: Config.AppConfig = new Config.AppConfig()
    super(cfg, routes.main.callRoutes)
  }
}

/**
 * para enviar a aplicacao a nivel do server será sempre levado o objeto app criado ao instanciar a aplicacao
 */
export let application = (new MainApp()).app
