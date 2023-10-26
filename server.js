const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

//importing the models
const Mentor = require("./models/Mentor");
const Student = require("./models/Student");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3000;
const DB_URl =
  "mongodb+srv://sivagraphics4fashion:guvi123@mycluster1.600dfem.mongodb.net/GUVI?retryWrites=true&w=majority";

//connect to MongoDB
mongoose
  .connect(DB_URl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Couldnot connect to MongDB ${err}`));

app.post("/mentor", async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    const data = await mentor.save();
    if (!data) {
      return res.status(400).json({
        error: "Error Occured While Uploading",
      });
    }
    res.status(201).json({
      data: data,
      message: "The mentor registerd successfully",
    });
    
  } catch (err) {
    console.log(error);
    res.status(500).json({ error: "Error Ocuured" });
  }
});

app.post("/student", async (req, res) => {
  try {
    const student = new Student(req.body);
    const data = await student.save();
    if (!data) {
      return res.status(400).json({
        error: "Error Occured While Uploading",
      });
    }
    res.status(201).json({
      data: data,
      message: "student registerd successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error Ocuured" });
  }
});

app.post("/mentor/:mentorId/assign", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId);
    const students = await Student.find({ _id: { $in: req.body.students } });
    students.forEach((student) => {
      student.current_Mentor = mentor._id;
      student.save();
    });
    mentor.students = [
      ...mentor.students,
      ...students.map((student) => student._id),
    ];
    await mentor.save();
    res.send(mentor);
  } catch (err) {
    res.status(500).json({ error: "Error Ocuured" });
  }
});

app.put("/student/:studentId/assignMentor/:mentorId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    newMentor = await Mentor.findById(req.params.mentorId);

    if (student.current_Mentor) {
      student.previous_Mentor.push(student.current_Mentor);
    }
    student.current_Mentor = newMentor._id;
    await student.save();
    res.send(student);
  } catch (err) {
    res.status(400).send("Error Ocuured", err);
  }
});

app.get("/mentors/:mentorId/students", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId).populate(
      "students"
    );
    res.send(mentor.students);
  } catch (err) {
    res.status(400).send("error occured", err);
  }
});

app.get("/student/:studentid/pMentors", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentid).populate(
      "pMentor"
    );
    res.send(student.pMentor);
  } catch (err) {
    res.status(400).send("error occured", err);
  }
});
// api for latest UI

app.get("/all_students", async (req, res) => {
  try {
    const all_students = await Student.find();
    res.send(all_students);
  } catch (err) {
    res.status(400).send("error occured");
  }
});

app.get("/all_mentors", async (req, res) => {
  try {
    const all_mentors = await Mentor.find();
    res.send(all_mentors);
  } catch (err) {
    res.status(400).send("error occured");
  }
});


app.post("/student/assign_mentor", async (req, res) => {
  try {
    const student = await Student.findOne({ name: req.body.studentname });
    const mentor = await Mentor.findOne({ name: req.body.mentorname });
    if (student.current_Mentor != ""){
      student.previous_Mentor = [...student.previous_Mentor, student.current_Mentor]
      student.current_Mentor = mentor.name;
      mentor.students = [...mentor.students, student.name]
    }
    await student.save();
    await mentor.save();
    res.send({ message: `assigned the mentor ${mentor.name} for the student ${student.name}` });
  } catch (err) {
    res.status(400).send("Error Ocuured", err);
  }
});

app.listen(PORT, () => console.log("Server is running in the port", PORT));
