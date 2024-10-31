import express from 'express'
import { getSleeves, postSleeve } from '../controllers/SleevesControllers'

const sleevesRouter = express.Router()

sleevesRouter.route('/')
  .get(getSleeves)
  .post(postSleeve)


export default sleevesRouter