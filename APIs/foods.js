import express from "express";
import { db, admin } from "../firebase.js";

const router = express.Router();

router.post("/addFoods", async (req, res) => {
  try {
    const { user_id, category_id, name } = req.body;

    const newFood = await db.collection("foods").add({
      user_id,
      category_id,
      name,
      created_at: admin.firestore.Timestamp.now()
    });

    res.status(201).json({ id: newFood.id, message: "Food created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getAllfoods", async (_, res) => {
  try {
    const snapshot = await db.collection("foods").get();
    const foods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getFood/:userId", async (req, res) => {
  try {
    const snapshot = await db.collection("foods").where("user_id", "==", req.params.userId).get();
    const foods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/updateFood/:id", async (req, res) => {
  try {
    await db.collection("foods").doc(req.params.id).update(req.body);
    res.json({ message: "Food updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteFood/:id", async (req, res) => {
  try {
    await db.collection("foods").doc(req.params.id).delete();
    res.json({ message: "Food deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
