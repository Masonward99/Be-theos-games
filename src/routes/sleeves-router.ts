import express from 'express'
import { deleteSleeve, getSleeve, getSleeveReviews, getSleeves, postSleeve, postSleeveReview } from '../controllers/SleevesControllers'

const sleevesRouter = express.Router()

sleevesRouter.route('/')
  .get(getSleeves)
  .post(postSleeve)

sleevesRouter.route('/:sleeve_id')
  .get(getSleeve)
  .delete(deleteSleeve)

sleevesRouter.route('/:sleeve_id/reviews')
  .get(getSleeveReviews)
  .post(postSleeveReview)

export default sleevesRouter