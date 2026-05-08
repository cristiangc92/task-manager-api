import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import pool from "../config/db.js";

dotenv.config()

export const register = async (req, res) => {
    const { name, email, password } = req.body

    if(!name || !email || !password){
        return res.status(400).json({ error: "Todos los campos son requeridos"})
    }

    try {
        //Verificar que el email ya existe
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        )

        if(existingUser.rows.length > 0){
            return res.status(409).json({ error: "El email ya esta registrado"})
        }

        //Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        //Crear usuario
        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        )

        const user = result.rows[0]

        //Generar JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(201).json({ user, token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({ error: "Email y contraseña requeridos" })
    }

    try {
        //Buscar usuario
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )

        if(result.rows.length === 0){
            return res.status(401).json({ error: "Credenciales invalidas" })
        }

        const user = result.rows[0]

        //Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password)

        if(!validPassword){
            return res.status(401).json({ error: "Credenciales invalidas" })
        }

        //Generar JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email }, token
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })
    }
}