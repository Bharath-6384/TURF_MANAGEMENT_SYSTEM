import express from 'express';
import corsConfig from './config/cors-config';
import AuthRoutes from './routes/auth-routes';
import AdminRoutes from './routes/admin-routes';
import UserRoutes from './routes/user-routes';
import CommonRoutes from './routes/common-routes';

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(corsConfig);

app.use("/api/auth",AuthRoutes);
app.use("/api/admin",AdminRoutes);
app.use("/api/user",UserRoutes);
app.use("/api/common",CommonRoutes);



export default app;