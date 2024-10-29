import express from 'express'
import { getCategories } from '../controllers/CategoriesController';

const categoriesRouter = express.Router();

categoriesRouter.route('/')
  .get(getCategories)
export default categoriesRouter