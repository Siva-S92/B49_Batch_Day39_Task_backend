 const mongoose = require('mongoose');

 const mentorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true
    },
    employeeNo: {
      type: String,
      required: true,
    },
    students: {
      type: [String]
   },

 });

 const Mentor = mongoose.model("Mentor", mentorSchema);

 module.exports = Mentor;