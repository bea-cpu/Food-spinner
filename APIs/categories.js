import express from "express";
import { db } from "../firebase.js";

const router = express.Router();

router.post("/addCategories", async (req, res) => {
  try {
    const { name, description } = req.body;

    const newCategory = await db.collection("categories").add({
      name,
      description
    });

    res.status(201).json({ id: newCategory.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getAllcategories", async (_, res) => {
  try {
    const snapshot = await db.collection("categories").get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getCategory/:id", async (req, res) => {
  try {
    const snap = await db.collection("categories").doc(req.params.id).get();

    if (!snap.exists) return res.status(404).json({ message: "Not found" });

    res.json({ id: snap.id, ...snap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/updateCategory/:id", async (req, res) => {
  try {
    await db.collection("categories").doc(req.params.id).update(req.body);
    res.json({ message: "Category updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteCategory/:id", async (req, res) => {
  try {
    await db.collection("categories").doc(req.params.id).delete();
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router
