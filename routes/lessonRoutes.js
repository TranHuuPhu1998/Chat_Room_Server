import express from "express";
import { assignLesson } from "../services/lessonService.js";

const router = express.Router();

router.post("/assignLesson", async (req, res) => {
  try {
    const { studentPhone, title, description } = req.body;
    if (!studentPhone || !title || !description) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const lesson = await assignLesson({ studentPhone, title, description });
    
    // Emit real-time update via Socket.io controller
    const io = req.app.get('io');
    if (io) {
      const socketController = new (await import('../services/socketService.js')).default(io);
      socketController.emitLessonAssigned(studentPhone, lesson);
    }
    
    res.json({ success: true, lesson });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
