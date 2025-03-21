import express from "express";
import * as utils from "./utils/utils.js";
import * as db from './utils/database.js';
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";


let data = ["Project 1", "Project 2", "Project 3"];
let projects = [];

const app = express();
app.use(cors());
const port = 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

// Route for Temp Home Page
app.get("/", (req, res) => {
  console.log(projects);
  res.render("temp.ejs", { projectArray: projects });
});

// Route for Home Page
// app.get("/", async (req, res, next) => {
//   await db
//   .connect()
//   .then(async() => {
//     //query the database for project records
//     projects = await db.getAllProjects();
//     console.log(projects);
//     res.render("index.ejs", { projects }); // Pass the projects array to the template);
//   })
//   .catch(next);
// });

// Route for Code Gallery Page
app.get("/gallery", (req, res) => {
  console.log(projects);
  res.render("gallery.ejs", { projectArray: projects });
});

// Route for Inidividual Artwork Page
app.get("/artwork/:id", (req, res) => {
  let id = parseInt(req.params.id, 10) - 1;
  if (id >= projects.length || id < 0) {
    return res.status(404).render("error.ejs", { message: "No artwork exists" });
  }
  console.log(projects[id]); // Debugging line
  res.render("artwork.ejs", { artwork: projects[id] });
});

// Route for Contact Page
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

// Route for About Page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

// Route for Temp Page
app.get("/temp", (req, res) => {
  res.render("temp.ejs");
});

// Route for Contact Form Submission
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

// Middleware to handle 404 errors
app.use((req, res, next) => {
  res.status(404).render("error.ejs");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error.ejs", { error: err });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});