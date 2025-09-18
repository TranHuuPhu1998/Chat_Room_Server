import express from "express";
import { createAccessCode, verifyAccessCode } from "../services/accessCodeService.js";
import { sendSMS } from "../services/twilioService.js";

const router = express.Router();

router.post("/createAccessCode", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ error: "phoneNumber required" });

    const code = await createAccessCode(phoneNumber);
    await sendSMS(phoneNumber, `Your access code is: ${code}`);

    // Emit real-time update via Socket.io controller
    const io = req.app.get('io');
    if (io) {
      const socketController = new (await import('../services/socketService.js')).default(io);
      socketController.emitAccessCodeSent(phoneNumber);
    }

    res.json({ success: true, message: "Code sent" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verifyAccessCode", async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) return res.status(400).json({ error: "Missing params" });

    const isValid = await verifyAccessCode(phoneNumber, code);
    
    // Emit real-time update via Socket.io controller
    const io = req.app.get('io');
    if (io) {
      const socketController = new (await import('../services/socketService.js')).default(io);
      socketController.emitAccessCodeVerified(phoneNumber, isValid);
    }
    
    res.json({ success: isValid });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
