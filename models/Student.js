const mongoose = require('mongoose');

 const studentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true
    },
    rollnumber: {
      type: String,
      required: true,
    },
    current_Mentor: {
      type: String,
      trim: true,
    },
    previous_Mentor: {
      type: [String]
    }

 });

 const Student = mongoose.model("Student", studentSchema);

 module.exports = Student;