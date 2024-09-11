// mainfolder/models/Timesheet.js

import mongoose from 'mongoose';
const timesheetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  date: { type: Date, required: true },
  start: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: (props) => `${props.value} is not a valid time format!`,
    },
  },
  end: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: (props) => `${props.value} is not a valid time format!`,
    },
  },
});

// const Timesheet =
export default mongoose.models.Timesheet ||
  mongoose.model('Timesheet', timesheetSchema);
