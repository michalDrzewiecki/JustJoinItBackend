import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import technologyModel from '../models/technology.model';
import offerModel from '../models/offer.model';
import ProblemWithDatabaseConnection from '../exceptions/ProblemWithDatabaseConnection';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import userModel from '../models/user.model';
import { DatabaseRequest } from 'interfaces/databaseRequest.interface';
import { MyParams } from './enums';
import { Technology } from 'interfaces/technology.interface';

class StaticDataController implements Controller {
  public path = '/staticData';
  private cookie = 'tokenCookie';
  private DEFAULT_PARAM = "all";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/technologies`, this.technologies);
    this.router.post(`${this.path}/offers`, this.offers);
  }

  private technologies = async(request: express.Request, response: express.Response, next: express.NextFunction) => {
    try{
        technologyModel.find().then(technologies => {
            response.send(technologies);
        })
    }catch{
        next(new ProblemWithDatabaseConnection());
    }
  }

  private offers = async(request: express.Request, response: express.Response, next: express.NextFunction) => {
    let params: string[] = request.body;
    let databaseRequest: DatabaseRequest = {};
    if(request.cookies[this.cookie] != null){
      let userID = await this.checkToken(this.cookie, request);
      if(userID != ""){
        databaseRequest["$or"] = [{isHidden: false }, {author: userID}];
      }
      else{
        databaseRequest["isHidden"] = false;
      }
    }
    else{
      databaseRequest["isHidden"] =  false;
    }
    if(params[MyParams.city] != this.DEFAULT_PARAM){
      databaseRequest["companyAddress.city"] = params[MyParams.city];
    }
    if(params[MyParams.technology] != this.DEFAULT_PARAM){
       await technologyModel.findOne({name:params[MyParams.technology]}).lean()
                              .then((technology: Technology)=>{
        if(technology != null){
          databaseRequest["requiredSkills.technology"] = technology._id;
        }
      })
    }
    if(params[MyParams.level] != this.DEFAULT_PARAM){
      databaseRequest["experience"] = params[MyParams.level];
    }
    if(params[MyParams.salary] != this.DEFAULT_PARAM){
      databaseRequest["salary.lowerLimit"] = {$gte: +params[MyParams.salary]};
    }
    try{
      console.log(databaseRequest);
        offerModel.find(databaseRequest)
          .populate('author', '-password -email -_id')
          .populate('requiredSkills.technology', '-_id -isHidden')
          .then(offers => {
            response.send(offers);
        })
    }catch(error){
      next(new ProblemWithDatabaseConnection());
    }
  }
 
  private async checkToken(cookie: string, request: express.Request): Promise<string>{
    const secret = process.env.JWT_SECRET;
      try {
        const verificationResponse = jwt.verify(request.cookies[this.cookie], secret) as DataStoredInToken;
        const id = verificationResponse._id;
        const user = await userModel.findById(id);
        if (user) {
          return user.id;
        }
      } catch (error) {
        return "";
      }
    return "";
  }
}


export default StaticDataController;
