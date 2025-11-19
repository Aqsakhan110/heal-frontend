export interface AppointmentType {
  _id: string;
  patientName: string;
  email: string;
  doctor: string;
  doctorId: string;
  specialty?: string;
  date: string;
  time: string;
}
