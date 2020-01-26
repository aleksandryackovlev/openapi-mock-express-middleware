import express from 'express';
import methodOverride from 'method-override';

const createRouter = (): express.Router => {
  const router = express.Router();

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(methodOverride());

  return router;
};

export default createRouter;
