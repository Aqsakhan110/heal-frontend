"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Remove appointment only from frontend state
  const removeAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((appt) => appt._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold mb-8 text-emerald-700 border-b pb-4 pt-14">
        My Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="divide-y divide-gray-200 bg-white shadow rounded-lg">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="flex justify-between items-center p-4 hover:bg-emerald-50 transition"
            >
              <div>
                <p className="text-gray-800">
                  <span className="font-semibold">Patient:</span> {appt.patientName}
                </p>
                 <p className="text-gray-800">
                  <span className="font-semibold">Email:</span> {appt.email}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Phone:</span> {appt.phone}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Doctor:</span> {appt.doctor}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Specialty:</span> {appt.specialty}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Date:</span> {appt.date}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Time:</span> {appt.time}
                </p>
              </div>

              {/* Remove button (frontend only) */}
              <button
                onClick={() => removeAppointment(appt._id)}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
