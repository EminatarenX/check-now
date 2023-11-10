import Empleado from '../models/Empleado.js'
import Empresa from '../models/Empresa.js'
import Usuario from '../models/Usuario.js'

const obtenerEmpleados = async(req, res) => {

    const { empresa } = req
    if (!empresa) {
        return res.status(404).json({ msg: "No se encontró la empresa" })
    }
    try {
        const empleados = await Empleado.find({ empresa: empresa.id })
        return res.status(200).json({ empleados })
    }catch(error) {
        return res.status(500).json({ error })
    }

}

const editarTuEmpleado = async(req, res) => {
    const { empresa } = req
    const { id } = req.params
    const { plaza } = req.body
    

    try{

        const empleado = await Empleado.findById(id) // Busca al empleado por su id

        if(!empleado) return res.status(404).json({msg: "No se ha encontrado a ese empleado"}); // Si no existe, devuelve un error
    
        if (empresa.id !== empleado.empresa) {
            return res.status(401).json({ msg: "No tienes permisos para editar esta empresa" })
        }

        empleado.plaza = plaza

        await empleado.save()

        return res.status(200).json({
            empleado
        })

    }catch(error){
        return res.status(500).json({error})
    }
}

const eliminarEmpleado = async(req, res) => {
    const { id } = req.params
    const {empresa} = req

    try {
    const empleado = await Empleado.findById(id)
    
    if(!empleado) return res.status(404).json({msg: "No se ha encontrado a ese empleado"});
    
    if (empresa.id !== empleado.empresa) {
        return res.status(401).json({ msg: "No tienes permisos para editar esta empresa" })
    }

        await Empleado.deleteById(id);

        return res.status(200).json({ empleado: empleado.id }) 
    }catch(error) {
        return res.status(500).json({ error })
    }
}

const editarEmpleado = async (req, res) => { /* Esta función la ejecuta el empleado*/

    const { usuario } = req;
    const { informacion_personal } = req.body;

    if(!usuario.empresa){
        return res.status(400).json({
            msg: "No encontrado"
        })
    }

    try{

        const empleado = await Empleado.findById(usuario.id)

        empleado.informacion_personal = informacion_personal

        await empleado.save();
        
        return res.status(200).json({
            empleado
        })

    }catch(error){
        return res.status(500).json({error})
    }

}

const JoinEmpresa = async (req, res) => {
    const { usuario } = req
    const { empresa: empresa_id, plaza } = req.body
  

    try {
        const empleado = await Empleado.findOne({usuario: usuario.id})
        empleado.empresa = empresa_id
        empleado.plaza = plaza
        await empleado.save()
        
        return res.status(200).json({msg: "Se ha unido a la empresa"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: "no se pudo actualizar la informacion", error })
    }
}

const obtenerEmpleadoinfo = async(req, res) => {

    const { empleado } = req    
    return res.status(200).json({ empleado})
    

}

export default{ obtenerEmpleados, editarTuEmpleado, eliminarEmpleado, editarEmpleado, JoinEmpresa, obtenerEmpleadoinfo }