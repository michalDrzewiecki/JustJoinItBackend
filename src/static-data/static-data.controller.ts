import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import technologyModel from './technology.model';
import offerModel from './offer.model';
import ProblemWithDatabaseConnection from '../exceptions/ProblemWithDatabaseConnection';

class StaticDataController implements Controller {
  public path = '/staticData';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/technologies`, this.technologies);
    this.router.get(`${this.path}/offers`, this.offers);
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
    try{
        offerModel.find({isHidden: false})
          .populate('author', '-password -email -_id')
          .populate('requiredSkills.technology', '-_id -isHidden')
          .then(offers => {
            response.send(offers);
        })
    }catch(error){
      console.log(error);
      next(new ProblemWithDatabaseConnection());
    }
  }
}

export default StaticDataController;
