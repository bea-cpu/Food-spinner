import express from "express";
import cors from "cors";

import usersRoute from "./APIs/users.js";
import foodsRoute from "./APIs/foods.js";
import categoriesRoute from "./APIs/categories.js";
import spinHistoryRoute from "./APIs/spinHistory.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/foods", foodsRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/spin-history", spinHistoryRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});