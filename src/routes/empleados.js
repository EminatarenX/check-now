
import {Router} from "express"
import empleadosController from "../controllers/empleados.js"
import { checkAuth } from "../helpers/checkAuth.js"

const router = Router()

router.get('/', checkAuth, empleadosController.obtenerEmpleados)
router.put("/editar/:id", empleadosController.editarTuEmpleado)
router.delete("/eliminar/:id", checkAuth, empleadosController.eliminarEmpleado)
router.put("/editar", checkAuth, empleadosController.editarEmpleado)

export default router
