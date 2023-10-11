import express from 'express';
const app = express();
const port = 3000;
import UserRoutes from './routes/userRoutes';
import ActivityRoutes from './routes/acitivityRoutes';
import AuthRoutes from './routes/authRoutes';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    name: 'session-id',
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 0.5 }
}))

const authRoutes = new AuthRoutes();
const userRoutes = new UserRoutes();
const activityRoutes = new ActivityRoutes();
authRoutes.applyRouting(app);
userRoutes.applyRouting(app);
activityRoutes.applyRouting(app);

app.listen(port, () => {console.log(`Listening on port ${port}`)});