import express  from 'express'
import { createAction ,createTrigger , getAllAction ,getAllTrigger } from '../Controller/CreateTypes.controller.js'


const Router = express.Router();




Router.post("/Action" ,createAction);
Router.post('/Trigger',createTrigger);
Router.get('/getAllTrigger',getAllTrigger);
Router.get('/getAllAction',getAllAction);

export default Router;