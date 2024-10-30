import express from 'express'
import { getSleeves } from '../controllers/SleevesControllers'

const sleevesRouter = express.Router()

sleevesRouter.route('/')
  .get(getSleeves)


export default sleevesRouter