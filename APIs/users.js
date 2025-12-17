import express from "express";
import { db, admin } from "../firebase.js";

const router = express.Router();

router.post("/addUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await db.collection("users").add({
      name,
      email,
      password,
      created_at: admin.firestore.Timestamp.now(),
    });

    res.status(201).json({ id: newUser.id, message: "User created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getAllusers", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getUser/:id", async (req, res) => {
  try {
    const snapshot = await db.collection("users").doc(req.params.id).get();

    if (!snapshot.exists) return res.status(404).json({ message: "Not found" });

    res.json({ id: snapshot.id, ...snapshot.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/updateUser/:id", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).update(req.body);
    res.json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).delete();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
