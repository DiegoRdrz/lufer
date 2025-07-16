import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import authRoutes from "./routes/authRoutes";
import bañoRoutes from "./routes/bañoRoutes";
import jabonRoutes from "./routes/jabonRoutes";
import menuRoutes from "./routes/menuRoutes";
import reservaRoutes from "./routes/reservaRoutes";
import userRoutes from "./routes/userRoutes";
import personalRoutes from "./routes/personalRoutes";
import elementosRoutes from "./routes/elementosRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/banos", bañoRoutes);
app.use("/api/jabones", jabonRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/reservas", reservaRoutes);   
app.use('/api/users', userRoutes); 
app.use("/api/personal", personalRoutes);
app.use("/api/elementos", elementosRoutes);

// Aquí luego agregaremos: baños, jabones, menús, reservas, usuarios

export default app;
