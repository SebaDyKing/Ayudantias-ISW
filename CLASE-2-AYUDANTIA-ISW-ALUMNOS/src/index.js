import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { AppDataSource, connectDB } from "./config/configDB.js";
import { routerApi } from "./routes/index.routes.js";
import {HOST,DB_PORT} from "./config/configDB.js"

const app = express();
app.use(express.json());
app.use(morgan("dev"));
// Ruta principal de bienvenida
app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi API REST con TypeORM!");
});

// Inicializa la conexión a la base de datos
connectDB()
  .then(() => {
    // Carga todas las rutas de la aplicación
    routerApi(app);

    app.listen(DB_PORT, () => {
      console.log(`Servidor iniciado en ${HOST}:${DB_PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });
