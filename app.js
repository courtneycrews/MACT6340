import express from "express";
import dotenv from "dotenv";
import * as utils from "./utils/utils.js";
dotenv.config();
import * as db from './utils/database.js';
let data = ["Project 1", "Project 2", "Project 3"];
let projects = [];

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

app.get("/", async (req, res, next) => {
  await db
  .connect()
  .then(async() => {
    //query the database for project records
    projects = await db.getAllProjects();
    console.log(projects);
    res.render("index.ejs");
  })
  .catch(next);
});

app.get("/gallery", (req, res) => {
  console.log(projects);
  res.render("gallery.ejs", { projectArray: projects });
});

app.get("/artwork/:id", (req, res) => {
  let id = req.params.id;
  if (id > data.length) {
    throw new Error("No artwork exists");
}
res.render("artwork.ejs", { projectArray: data, which: id });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/mail", async (req, res) => {
  await utils
  .sendMessage(req.body.sub, req.body.txt)
  .then(() => {
    res.send({ result: "Message has been sent!" });
  })
  .catch(() => {
    res.send({ result: "failure" });
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.render("error.ejs");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})