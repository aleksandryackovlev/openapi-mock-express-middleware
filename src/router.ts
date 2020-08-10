import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';

const createRouter = (corsOptions: CorsOptions): express.Router => {
  const router = express.Router();

  router.use(cors(corsOptions));
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(methodOverride());
  router.use(cookieParser());

  return router;
};

export default createRouter;
