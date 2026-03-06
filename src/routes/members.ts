import { Router } from "express";
import fs from "fs";

const router = Router();
const filePath = "./src/data.json";

function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeData(data: object) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// här hämtar fron§tend alla medlemmar från backend
router.get("/", (req, res) => {
  const data = readData();
  res.json(data.members);
});

router.post("/", (req, res) => {
  const data = readData();
  const newMember = {
    id: crypto.randomUUID(),
    ...req.body
  };

  data.members.push(newMember);
  writeData(data);

  res.status(201).json(newMember);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  // Läs filen
  const raw = fs.readFileSync("./src/data.json", "utf-8");
  const data = JSON.parse(raw);

  // Filtrera bort medlemmen
  data.members = data.members.filter((member: { id: string }) => member.id !== id);

  // Skriv tillbaka till filen
  fs.writeFileSync("./src/data.json", JSON.stringify(data, null, 2));

  res.json({ message: "Member deleted" });
});
export default router;

router.patch("/:id", (req, res) => {
    const data = readData();

    const memberIndex = data.members.findIndex(
        (m: { id: string }) => m.id === req.params.id
    );

    // Om medlemmen inte finns, returnera 404
    if (memberIndex === -1) {
        return res.status(404).json({ message: "Member not found" });
    }

    data.members[memberIndex] = {
        ...data.members[memberIndex],
        ...req.body
    };

    writeData(data);

    res.json(data.members[memberIndex]);
});

