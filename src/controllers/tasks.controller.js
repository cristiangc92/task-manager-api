import pool from "../config/db.js"

export const getTasks = async (req, res) => {
    const { id } = req.user
    const { status, priority } = req.query

    try {
        let query = "SELECT * FROM tasks WHERE user_id = $1"
        const params = [id]

        if(status){
            query += ` AND status = $${params.length + 1}`
            params.push(status)
        }

        if(priority){
            query += ` AND priority = $${params.length + 1}`
            params.push(priority)
        }

        query += " ORDER BY created_at DESC"

        const result = await pool.query(query, params)
        res.status(200).json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })
    }
}

export const createTask = async (req, res) => {
    const { id } = req.user
    const { title, description, status, priority } = req.body

    if(!title){
        return res.status(400).json({ error: "El titulo es requerido" })
    }

    try {
        const result = await pool .query(
            `INSERT INTO tasks (user_id, title, description, status, priority)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [id, title, description || null, status || "pending", priority || "medium"]
        )

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })        
    }
}

export const updateTask = async (req, res) => {
    const { id: userId } = req.user
    const { id } = req.params
    const { title, description, status, priority } = req.body

    try {
        //Verificar que la tarea pertenece al usuario
        const task = await pool.query(
            "SELECT id FROM tasks WHERE id = $1 AND user_id = $2",
            [id, userId]
        )

        if(task.rows.length === 0){
            return res.status(404).json({ error: "Tarea no encontrada" })
        }

        const result = await pool.query(
            `UPDATE tasks SET
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            status = COALESCE($3, status),
            priority = COALESCE($4, priority)
            WHERE id = $5 AND user_id = $6
            RETURNING *`,
            [title, description, status, priority, id, userId]
        )

        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })
    }
}

export const deleteTask = async (req, res) => {
  const { id: userId } = req.user
  const { id } = req.params

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" })
    }

    res.status(200).json({ message: "Tarea eliminada correctamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}