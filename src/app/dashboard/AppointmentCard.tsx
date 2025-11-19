"use client";

export default function AppointmentCard({ appointment }: { appointment: any }) {
  return (
    <div className="border p-4 rounded-md shadow-md bg-white">
      <h3 className="font-bold text-lg text-emerald-700">{appointment.patientName}</h3>
      <p className="text-gray-700">
        Doctor: <span className="font-medium">{appointment.doctor}</span>
      </p>
      <p className="text-gray-700">
        Specialty: <span className="font-medium">{appointment.specialty}</span>
      </p>
      <p className="text-gray-700">
        Date: <span className="font-medium">{appointment.date}</span>
      </p>
      <p className="text-gray-700">
        Time: <span className="font-medium">{appointment.time}</span>
      </p>
      <p className="text-gray-700">
        Status: <span className="font-medium">{appointment.status ?? "Pending"}</span>
      </p>
    </div>
  );
}
