import express from "express";
import cors from "cors";
import membersRouter from "./routes/members";
import assignmentsRouter from "./routes/assignments";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/members", membersRouter);
app.use("/assignments", assignmentsRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});