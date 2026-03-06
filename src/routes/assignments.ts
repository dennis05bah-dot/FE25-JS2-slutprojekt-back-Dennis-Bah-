import { Router } from "express";
import fs from "fs";
import { randomUUID } from "crypto";

const router = Router();
const filePath = "./src/data.json";

// Läs data
function readData() {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
}

// Skriv data
function writeData(data: object)  {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// =====================
// GET alla assignments
// =====================
router.get("/", (req, res) => {
    const data = readData();
    res.json(data.assignments);
});

// =====================
// POST skapa assignment
// =====================
router.post("/", (req, res) => {
    const data = readData();

    const newAssignment = {
    id: randomUUID(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    status: "new",
    assignedto: null,
    timestamp: new Date().toISOString()
    };

    data.assignments.push(newAssignment);
    writeData(data);

    res.status(201).json(newAssignment);
});

// =====================
// PATCH (assign eller done)
// =====================
router.patch("/:id", (req, res) => {
const data = readData();

const assignment = data.assignments.find(
    (a: { id: string }) => a.id === req.params.id
);

if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
}

  // tilldela medlem
if (req.body.assignedto) {
    assignment.assignedto = req.body.assignedto;
    assignment.status = "doing";
}

  // markera som done
if (req.body.status === "done") {
    assignment.status = "done";
}

writeData(data);
res.json(assignment);
});

// =====================
// DELETE
// =====================
router.delete("/:id", (req, res) => {
const data = readData();

data.assignments = data.assignments.filter(
    (a: { id: string }) => a.id !== req.params.id
);

writeData(data);

res.json({ message: "Assignment deleted" });
});

export default router;
