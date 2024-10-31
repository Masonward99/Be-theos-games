import express from 'express'
import { getSleeve, getSleeves, postSleeve } from '../controllers/SleevesControllers'

const sleevesRouter = express.Router()

sleevesRouter.route('/')
  .get(getSleeves)
  .post(postSleeve)

sleevesRouter.route('/:sleeve_id')
  .get(getSleeve)

export default sleevesRouter