import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';

const createRouter = (): express.Router => {
  const router = express.Router();

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(methodOverride());
  router.use(cookieParser());

  return router;
};

export default createRouter;
