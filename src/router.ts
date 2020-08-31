import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';

const createRouter = ({
  enabled,
  ...corsOptions
}: CorsOptions & { enabled?: boolean }): express.Router => {
  const router = express.Router();

  if (enabled) {
    router.options('*', cors(corsOptions));
    router.use(cors(corsOptions));
  }

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(methodOverride());
  router.use(cookieParser());

  return router;
};

export default createRouter;
