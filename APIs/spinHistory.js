import express from "express";
import { db, admin } from "../firebase.js";

const router = express.Router();

router.post("/addSpin-history", async (req, res) => {
  try {
    const { user_id, food_id } = req.body;

    const newSpin = await db.collection("spin_history").add({
      user_id,
      food_id,
      timestamp: admin.firestore.Timestamp.now()
    });

    res.status(201).json({ id: newSpin.id, message: "Spin saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getSpin-history/:userId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("spin_history")
      .where("user_id", "==", req.params.userId)
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router
