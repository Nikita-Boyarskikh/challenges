// Import Configuration.
import { WebpackDevConfig } from './webpack/dev.cjs';
import { WebpackProdConfig } from './webpack/prod.cjs';
import { config } from './configuration/index.cjs';

export default config.IS_DEV ? WebpackDevConfig : WebpackProdConfig;
