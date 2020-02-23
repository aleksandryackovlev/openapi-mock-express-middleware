import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const createRouter = (): express.Router => {
  const router = express.Router();

  router.use(cors());
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(methodOverride());
  router.use(cookieParser());

  return router;
};

export default createRouter;
