import mongoose, { Schema, Document } from "mongoose";

export interface AppointmentDocument extends Document {
  patientName: string;
  email: string;
  doctor: string;
  doctorId: string;
  specialty?: string;
  date: string;
  time: string;
}

const AppointmentSchema = new Schema<AppointmentDocument>({
  patientName: { type: String, required: true },
  email: { type: String, required: true },
  doctor: { type: String, required: true },
  doctorId: { type: String, required: true },
  specialty: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<AppointmentDocument>("Appointment", AppointmentSchema);

export default Appointment;
