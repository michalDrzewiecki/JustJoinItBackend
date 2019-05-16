import * as bcrypt from 'bcrypt';
import * as express from 'express';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import userModel from './../user/user.model';
import AuthenticationService from './authentication.service';
import LogInDto from './logIn.dto';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  public authenticationService = new AuthenticationService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    console.log(request.body + " " + userData);
    try {
      const {
        cookie,
        user,
      } = await this.authenticationService.register(userData);
      response.send(user);
    } catch (error) {
      next(error);
    }
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData: LogInDto = request.body;
    let user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.authenticationService.createToken(user);
        //response.setHeader('Set-Cookie', [this.authenticationService.createCookie(tokenData)]);
        let data = {user: user, token: tokenData};
        response.send(data);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private loggingOut = (request: express.Request, response: express.Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  }


}

export default AuthenticationController;
