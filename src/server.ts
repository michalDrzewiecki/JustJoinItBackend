import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import AuthenticationController from './authentication/authentication.controller';
import StaticDataController from './static-data/static-data.controller';
 
validateEnv();
const app = new App(
  [
    new AuthenticationController(),
    new StaticDataController(),
  ],
);
app.listen();