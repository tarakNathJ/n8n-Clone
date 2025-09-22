import express  from 'express'
import {signUpController ,LoginController ,updatePassword} from '../Controller/Auth.Controller.js'


const Router = express.Router();




Router.post("/SighUp" ,signUpController);
Router.post('/login',LoginController);
Router.post('/updatePassword', updatePassword);

export default Router;