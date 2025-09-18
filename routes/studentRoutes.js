import express from "express";
import { addStudent, getAllStudents, getStudentWithLessons } from "../services/studentService.js";

const router = express.Router();

router.post("/addStudent", async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const student = await addStudent({ name, phone, email });
    
    // Emit real-time update via Socket.io controller
    const io = req.app.get('io');
    if (io) {
      const socketController = new (await import('../services/socketService.js')).default(io);
      socketController.emitStudentAdded(student);
    }
    
    res.json({ success: true, student });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/students", async (req, res) => {
    try {
      const students = await getAllStudents();
      res.json({ success: true, students });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/student/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      const student = await getStudentWithLessons(phone);
      res.json({ success: true, student });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
});



export default router;
