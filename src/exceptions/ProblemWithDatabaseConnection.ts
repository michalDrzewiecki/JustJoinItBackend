import HttpException from './HttpException';

class ProblemWithDatabaseConnection extends HttpException {
  constructor() {
    super(400, "Problem with database connection");
  }
}

export default ProblemWithDatabaseConnection;