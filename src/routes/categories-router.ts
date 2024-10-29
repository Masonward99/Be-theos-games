import express from 'express'
import { postCategory, getCategories } from '../controllers/CategoriesController';

const categoriesRouter = express.Router();

categoriesRouter.route('/')
  .get(getCategories)
  .post(postCategory)
export default categoriesRouter