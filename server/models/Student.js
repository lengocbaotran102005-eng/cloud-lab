const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String },
  mssv: { type: String },
  maSV: { type: String },
  name: { type: String },
  hoTen: { type: String },
  email: { type: String }
}, { timestamps: true });

// Tự động map giá trị studentId và mssv trước khi lưu
studentSchema.pre('save', function(next) {
  const idValue = this.mssv || this.maSV || this.studentId;
  this.studentId = idValue;
  this.mssv = idValue;
  this.maSV = idValue;

  const nameValue = this.name || this.hoTen;
  this.name = nameValue;
  this.hoTen = nameValue;
  
  next();
});

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);