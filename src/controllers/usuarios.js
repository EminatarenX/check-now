import Usuario from "../models/Usuario.js"
import bcrypt from 'bcrypt'
import { generarID } from "../helpers/generarId.js"
import { emailRegistro } from "../helpers/confirmarCuenta.js"
import { response } from "express"
import jwt from 'jsonwebtoken'

const obtenerUsuarios = async(req, res) => {
    //crear una variable por si pone un usuario especifico
    const { usuarioId } = req.params
    if(usuarioId) {
        try {
            const usuario = await Usuario.findById(usuarioId)
            return res.json(usuario)
        } catch (error) {
            console.log(error)
        }
    }
    try {
        const usuarios = await Usuario.find()

        res.json(usuarios)

    } catch (error) {
        console.log(error)
    }
}

const crearUsuario = async (req, res) => {
    const { correo, password } = req.body

    try {
        const usuarioExiste = await Usuario.findOne({correo})

        if(usuarioExiste) {
            const error = new Error("El usuario ya esta registrado")
            return res.status(400).json({msg: error.message})
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        const token = generarID()

        emailRegistro({correo, token})

        const usuario = new Usuario({
            correo, 
            password: hashedPassword,
            token
        })



        await usuario.save()

        return res.json({
            msg: {
                titulo: "¡Cuenta creada!",
                cuerpo: "Hemos enviado un mensaje de verificación a tu correo electrónico"
            },
            usuario
        })
        
    } catch (error) {
        return res.status(400).json({msg: "Hubo un error, Intenta mas tarde", error})
    }
}

const iniciarSesion = async (req, res) => {
    const { correo, password } = req.body

    try {
        const existeUsuario = await Usuario.findOne({correo})

        if(!existeUsuario) {
            const error = new Error("El usuario no existe")
            return res.status(400).json({msg: error.message})
        }

        if(existeUsuario.token) {
            const error = new Error("El usuario no esta verificado")
            return res.status(400).json({msg: error.message})
        }

        const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password)

        if(!passwordCorrecto) {
            const error = new Error("Contraseña incorrecta")
            return res.status(400).json({msg: error.message})
        }

        const token = jwt.sign({id: existeUsuario._id}, process.env.JWT_SECRET, {expiresIn: "30m"})

        return res.json({
            msg: {
                titulo: "¡Bienvenido!",
                cuerpo: "Has iniciado sesión correctamente"
            },
            token
        })

    } catch (error) {
        console.log(error)
    }
}

const confirmarUsuario = async(req, res) =>{
    const { token } = req.params

    try {
        let usuario = await Usuario.findOne({token})

        if(!usuario){
            const error = new Error("El usuario ya ha sido confirmado")
            return res.status(404).json({msg: error.message})
        }
        
        usuario.token = ""

        await usuario.save()

        return res.status(200).json({
            msg: {
                titulo: "Cuenta verificada!",
                cuerpo: "Ahora puedes iniciar sesion :)"
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const completarPerfil = async (req, res) => {
    const { nombre, apellido, telefono, direccion, role,  } = req.body
    const usuarioAutenticado = req.usuario


    console.log(usuarioAutenticado)
    return
    try {

        // const usuario = await Usuario.findOne({token})

        // if(!usuario) {
        //     const error = new Error("El usuario no existe")
        //     return res.status(400).json({msg: error.message})
        // }

        // usuario.nombre = nombre
        // usuario.apellido = apellido
        // usuario.telefono = telefono
        // usuario.direccion = direccion
        // usuario.token = token
        // usuario.role = role

        // await usuario.save()

        return res.json({
            msg: {
                titulo: "¡Registro completado!",
                cuerpo: nombre + " " + apellido + " ya puedes iniciar sesión"

            },
            // usuario
        })
        
    } catch (error) {
        return res.status(400).json({msg: "Hubo un error, Intenta mas tarde", error})
    }
}



export default {
    obtenerUsuarios,
    crearUsuario,
    iniciarSesion,
    confirmarUsuario,
    completarPerfil
}
