import express from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import db from '$config/db';

import { authRoutes } from '$components/auth'
import { userRoutes } from '$components/user'

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());

db.sync()
  .then(() => console.log(`DATABASE CONNECTED IN PORT: ${process.env.DB_PORT}`))
  .catch(error => console.log(error));

/*ROUTES*/
app.use(authRoutes);
app.use(userRoutes);


/*SERVER*/
const port = process.env.PORT || 5001;

const host = process.env.HOST || '127.0.0.1';

app.listen(port, host, () => {

  console.log(`Development Server in http://${host}:${port}`);

});
