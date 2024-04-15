import { Router } from "express";
const router = Router();
import * as valid from "../valid.js";

router.route('/').get(async (req, res) => {
    try{
      /*eh something*/
    }catch(e){
      res.sendStatus(500);
    }
  });

export default router;