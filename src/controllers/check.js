import Check from "../models/Check.js";

const obtenerChecks = async(req, res) => {
    const empresa = req.empresa

    try {

        const checks = await Check.find({empresa: empresa.id})
            .populate({
                path: "empleado",
                populate: [
                    {
                        path: "plaza",
                        populate: {
                            path: "categoria",
                            populate: {
                                path: "departamento"
                            }
                        }
                    },
                    {
                        path: "usuario" // Agregamos el populate para "usuario" aquí
                    }
                ]
            })
            .sort({fecha_entrada: -1});

        if(checks.length === 0){
            return res.status(400).json({msg: 'No hay registros', checks: []})
        }

            return res.status(200).json({checks})
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: 'Error al obtener checks'
        })
    }


}

const obtenerChecksUsuario = async (req, res) => {
    const { empleado } = req;
    try {

        const checks = await Check.find({ empleado: empleado.id })
        .populate({
        path: "empleado",
        populate: [
            {
                path: "plaza",
                populate: {
                    path: "categoria",
                    populate: {
                        path: "departamento"
                    }
                }
            },
            {
                path: "usuario" // Agregamos el populate para "usuario" aquí
            }
        ]
    })
    .sort({fecha_entrada: -1});


        if(checks.length === 0) {
            return res.status(404).json({msg: 'No hay registros', checks: []})
        }

        return res.status(200).json({checks})
        
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: "Hubo un error al obtener los checks",
            error
        })
    }
}

const registrarCheckUsuario = async (req, res) => {
    const { empleado } = req;
    const {comentarios } = req.body;

    try {

        const checkSinSalida = await Check.findOne({empleado: empleado.id, fecha_salida: null}).sort({fecha_entrada: -1});

        if(checkSinSalida){
            return res.status(400).json({msg: "Ya hay un registro de entrada sin salida"})
        }

        const check = await Check.create({
            empresa: empleado.empresa.id,
            empleado: empleado.id,
            comentarios
        });

        const checkEncontrado = await Check.findById(check.id)
        .populate({
            path: "empleado",
            populate: [
                {
                    path: "plaza",
                    populate: {
                        path: "categoria",
                        populate: {
                            path: "departamento"
                        }
                    }
                },
                {
                    path: "usuario" // Agregamos el populate para "usuario" aquí
                }
            ]
        });
        
        if(!checkEncontrado){
            return res.status(404).json({msg: "No se pudo mandar la solicitud, intente mas tarde"})
        };

        return res.status(200).json({
            check: checkEncontrado
        });
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hubo un error, intenta mas tarde',
            error
        });
    }

}

const registrarSalidaUsuario = async(req, res) => {
    const { empleado } = req;

    try {

        const checkEncontrado = await Check.findOne({empleado: empleado.id, fecha_salida: null}).sort({fecha_entrada: -1});

        if(!checkEncontrado){
            return res.status(400).json({msg: "No hay registro de una entrada previa"})
        }

        checkEncontrado.fecha_salida = Date.now();
        await checkEncontrado.save();

        return res.status(200).json({
            check: checkEncontrado
        });

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'No se pudo registrar la salida, intenta mas tarde',
            error
        });
    }

}

export default { 
    obtenerChecks,
    registrarCheckUsuario,
    obtenerChecksUsuario,
    registrarSalidaUsuario
 };