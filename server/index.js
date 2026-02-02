const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json());

// Logger Middleware: عشان تفهم الـ Nginx بيبعت إيه بالظبط
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
// لاحظ إضافة /api قبل كل مسار عشان يطابق تحويل الـ Nginx

// Create a todo
app.post("/api/TodoTraverse", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description],
    );
    res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error("Error in POST /api/TodoTraverse:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Get all todos
app.get("/api/TodoTraverse", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.error("Error in GET /api/TodoTraverse:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Get a todo
app.get("/api/TodoTraverse/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error("Error in GET /api/TodoTraverse/:id:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Update a todo
app.put("/api/TodoTraverse/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [
      description,
      id,
    ]);
    res.json("Todo was updated!");
  } catch (err) {
    console.error("Error in PUT /api/TodoTraverse/:id:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a todo
app.delete("/api/TodoTraverse/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.error("Error in DELETE /api/TodoTraverse/:id:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
