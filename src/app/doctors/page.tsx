// "use client";

// import { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter, useSearchParams } from "next/navigation";

// type Doctor = {
//   id: string;
//   name: string;
//   specialty: string;
//   fees: number;
//   rating: number;
//   image: string;
//   experience: string;
//   location: string;
//   availability: string;
// };

// export default function DoctorsPage() {
//   const { isSignedIn } = useUser();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [search, setSearch] = useState("");
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

//   // Load static doctors list
//   useEffect(() => {
//     const doctorsList: Doctor[] = [
//       {
//         id: "doc_1",
//         name: "Dr. Ayesha Khan",
//         specialty: "Cardiologist",
//         fees: 1500,
//         rating: 5,
//         image: "/images/doctors/ayesha.jpg",
//         experience: "8 years",
//         location: "Karachi",
//         availability: "Mon-Fri, 9am-5pm",
//       },
//       {
//         id: "doc_2",
//         name: "Dr. Bilal Ahmed",
//         specialty: "Dermatologist",
//         fees: 1200,
//         rating: 4,
//         image: "/images/doctors/bilal.jpg",
//         experience: "6 years",
//         location: "Lahore",
//         availability: "Tue-Sat, 10am-4pm",
//       },
//       {
//         id: "doc_3",
//         name: "Dr. Sara Malik",
//         specialty: "Pediatrician",
//         fees: 1000,
//         rating: 5,
//         image: "/images/doctors/sara.jpg",
//         experience: "4 years",
//         location: "Karachi",
//         availability: "Mon-Fri, 11am-6pm",
//       },
//       {
//         id: "doc_4",
//         name: "Dr. Imran Ali",
//         specialty: "Orthopedic",
//         fees: 1800,
//         rating: 4,
//         image: "/images/doctors/imran.jpg",
//         experience: "10 years",
//         location: "Islamabad",
//         availability: "Mon-Thu, 9am-3pm",
//       },
//       {
//         id: "doc_5",
//         name: "Dr. Ahmed Sheikh",
//         specialty: "Dentist",
//         fees: 2000,
//         rating: 5,
//         image: "/images/doctors/ahmed.jpg",
//         experience: "7 years",
//         location: "Karachi",
//         availability: "Wed-Sun, 12pm-7pm",
//       },
//       {
//         id: "doc_6",
//         name: "Dr. Kamran Hussain",
//         specialty: "Neurologist",
//         fees: 2500,
//         rating: 5,
//         image: "/images/doctors/kamran.jpg",
//         experience: "12 years",
//         location: "Lahore",
//         availability: "Mon-Fri, 10am-5pm",
//       },
//       {
//         id: "doc_7",
//         name: "Dr. Faheem Noor",
//         specialty: "Psychiatrist",
//         fees: 2200,
//         rating: 4,
//         image: "/images/doctors/faheem.jpg",
//         experience: "5 years",
//         location: "Karachi",
//         availability: "Tue-Sat, 2pm-8pm",
//       },
//       {
//         id: "doc_8",
//         name: "Dr. Usman Raza",
//         specialty: "ENT Specialist",
//         fees: 1300,
//         rating: 4,
//         image: "/images/doctors/usman.jpg",
//         experience: "6 years",
//         location: "Islamabad",
//         availability: "Mon-Fri, 9am-1pm",
//       },
//     ];
//     setDoctors(doctorsList);
//   }, []);

//   // Auto-open popup if redirected back with doctor id
//   useEffect(() => {
//     const doctorId = searchParams.get("id");
//     if (isSignedIn && doctorId && doctors.length > 0) {
//       const doctor = doctors.find((d) => d.id === doctorId);
//       if (doctor) setSelectedDoctor(doctor);
//     }
//   }, [isSignedIn, searchParams, doctors]);

//   const handleBookClick = (doctor: Doctor) => {
//     if (!isSignedIn) {
//       router.push(`/sign-in?redirect=/doctors&id=${doctor.id}`);
//       return;
//     }
//     setSelectedDoctor(doctor);
//   };

//   // ✅ This was missing before
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedDoctor) return;

//     const formData = new FormData(e.currentTarget);
//     const patientName = formData.get("patientName") as string;
//     const email = formData.get("email") as string;
//     const date = formData.get("date") as string;
//     const time = formData.get("time") as string;

//     try {
//       const res = await fetch("/api/appointments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           patientName,
//           email,
//           doctor: selectedDoctor.name,
//           doctorId: selectedDoctor.id,
//           specialty: selectedDoctor.specialty,
//           date,
//           time,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert("❌ Error: " + (data.error || `Status ${res.status}`));
//         return;
//       }

//       alert("✅ Appointment booked!");
//       setSelectedDoctor(null);
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert("❌ Network error. Please try again.");
//     }
//   };

//   return (
//     <div className="pt-24 max-w-7xl mx-auto px-4">
//       <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 mb-8 text-center animate-fade-in">
//         Find Your Doctor
//       </h1>

//       {/* Search bar */}
//       <div className="flex items-center gap-2 mb-12 animate-fade-in">
//         <input
//           type="text"
//           placeholder="Search by name or specialty..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-1 border border-emerald-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//         />
//       </div>

//       {/* Doctors grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
//         {doctors
//           .filter(
//             (d) =>
//               d.name.toLowerCase().includes(search.toLowerCase()) ||
//               d.specialty.toLowerCase().includes(search.toLowerCase())
//           )
//           .map((doctor) => (
//             <div
//               key={doctor.id}
//               className="bg-white border border-emerald-100 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 animate-zoom-in"
//             >
//               <img
//                 src={doctor.image}
//                 alt={doctor.name}
//                 className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-emerald-200"
//               />
//               <p className="text-lg font-bold text-emerald-700">{doctor.name}</p>
//               <p className="text-sm text-slate-600 mb-1">{doctor.specialty}</p>
//               <p className="text-sm text-slate-500">Experience: {doctor.experience}</p>
//               <p className="text-sm text-slate-500">Location: {doctor.location}</p>
//               <p className="text-sm text-slate-500">Availability: {doctor.availability}</p>
//               <p className="text-sm text-slate-600 mt-2">
//                 Fee: <span className="font-semibold">Rs {doctor.fees}</span>
//               </p>
//               <div className="flex justify-center mt-2">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <span
//                     key={i}
//                     className={`text-yellow-400 text-lg ${
//                       i < doctor.rating ? "opacity-100" : "opacity-30"
//                     }`}
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>
//               <button
//                 onClick={() => handleBookClick(doctor)}
//                 className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition duration-200"
//               >
//                 Book Appointment
//               </button>
//             </div>
//           ))}
//       </div>

//             {/* Popup appointment form */}
//       {selectedDoctor && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md animate-zoom-in">
//             <h2 className="text-xl font-bold mb-4 text-emerald-700">
//               Book Appointment with {selectedDoctor.name}
//             </h2>
//             <form onSubmit={handleSubmit}>
//               <label className="block mb-3">
//                 Your Name
//                 <input
//                   type="text"
//                   name="patientName"
//                   required
//                   className="w-full border rounded p-2 mt-1"
//                 />
//               </label>
//               <label className="block mb-3">
//                 Email
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   className="w-full border rounded p-2 mt-1"
//                 />
//               </label>
//               <label className="block mb-3">
//                 Date
//                 <input
//                   type="date"
//                   name="date"
//                   required
//                   className="w-full border rounded p-2 mt-1"
//                   min={new Date().toISOString().split("T")[0]}
//                   max={new Date(
//                     new Date().setFullYear(new Date().getFullYear() + 1)
//                   )
//                     .toISOString()
//                     .split("T")[0]}
//                 />
//               </label>
//               <label className="block mb-3">
//                 Time
//                 <input
//                   type="time"
//                   name="time"
//                   required
//                   className="w-full border rounded p-2 mt-1"
//                 />
//               </label>
//               <div className="flex justify-end mt-4">
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
//                 >
//                   Confirm
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter, useSearchParams } from "next/navigation";

// type Doctor = {
//   id: string;
//   name: string;
//   specialty: string;
//   fees: number;
//   rating: number;
//   image: string;
//   experience: string;
//   location: string;
//   availability: string;
// };

// export default function DoctorsPage() {
//   const { isSignedIn } = useUser();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [search, setSearch] = useState("");
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Static doctors list (memoized to avoid re-creation)
//   const doctorsList = useMemo<Doctor[]>(
//     () => [
//       {
//         id: "doc_1",
//         name: "Dr. Ayesha Khan",
//         specialty: "Cardiologist",
//         fees: 1500,
//         rating: 5,
//         image: "/images/doctors/ayesha.jpg",
//         experience: "8 years",
//         location: "Karachi",
//         availability: "Mon-Fri, 9am-5pm",
//       },
//       {
//         id: "doc_2",
//         name: "Dr. Bilal Ahmed",
//         specialty: "Dermatologist",
//         fees: 1200,
//         rating: 4,
//         image: "/images/doctors/bilal.jpg",
//         experience: "6 years",
//         location: "Lahore",
//         availability: "Tue-Sat, 10am-4pm",
//       },
//       {
//         id: "doc_3",
//         name: "Dr. Sara Malik",
//         specialty: "Pediatrician",
//         fees: 1000,
//         rating: 5,
//         image: "/images/doctors/sara.jpg",
//         experience: "4 years",
//         location: "Karachi",
//         availability: "Mon-Fri, 11am-6pm",
//       },
//       {
//         id: "doc_4",
//         name: "Dr. Imran Ali",
//         specialty: "Orthopedic",
//         fees: 1800,
//         rating: 4,
//         image: "/images/doctors/imran.jpg",
//         experience: "10 years",
//         location: "Islamabad",
//         availability: "Mon-Thu, 9am-3pm",
//       },
//       {
//         id: "doc_5",
//         name: "Dr. Ahmed Sheikh",
//         specialty: "Dentist",
//         fees: 2000,
//         rating: 5,
//         image: "/images/doctors/ahmed.jpg",
//         experience: "7 years",
//         location: "Karachi",
//         availability: "Wed-Sun, 12pm-7pm",
//       },
//       {
//         id: "doc_6",
//         name: "Dr. Kamran Hussain",
//         specialty: "Neurologist",
//         fees: 2500,
//         rating: 5,
//         image: "/images/doctors/kamran.jpg",
//         experience: "12 years",
//         location: "Lahore",
//         availability: "Mon-Fri, 10am-5pm",
//       },
//       {
//         id: "doc_7",
//         name: "Dr. Faheem Noor",
//         specialty: "Psychiatrist",
//         fees: 2200,
//         rating: 4,
//         image: "/images/doctors/faheem.jpg",
//         experience: "5 years",
//         location: "Karachi",
//         availability: "Tue-Sat, 2pm-8pm",
//       },
//       {
//         id: "doc_8",
//         name: "Dr. Usman Raza",
//         specialty: "ENT Specialist",
//         fees: 1300,
//         rating: 4,
//         image: "/images/doctors/usman.jpg",
//         experience: "6 years",
//         location: "Islamabad",
//         availability: "Mon-Fri, 9am-1pm",
//       },
//     ],
//     []
//   );

//   useEffect(() => {
//     setDoctors(doctorsList);
//   }, [doctorsList]);

//   // Auto-open popup if redirected back with doctor id
//   useEffect(() => {
//     const doctorId = searchParams?.get("id");
//     if (!doctorId || doctors.length === 0) return;
//     if (isSignedIn) {
//       const doctor = doctors.find((d) => d.id === doctorId);
//       if (doctor) setSelectedDoctor(doctor);
//     }
//   }, [isSignedIn, searchParams, doctors]);

//   const handleBookClick = (doctor: Doctor) => {
//     if (!isSignedIn) {
//       router.push(`/sign-in?redirect=/doctors&id=${doctor.id}`);
//       return;
//     }
//     setSelectedDoctor(doctor);
//   };

//   const validatePhone = (phone: string) => {
//     // Simple sanity check; adjust to your preferred format
//     return phone && phone.length >= 7;
//   };

//   // Submit appointment form
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedDoctor || submitting) return;

//     const formData = new FormData(e.currentTarget);
//     const patientName = (formData.get("patientName") as string)?.trim();
//     const email = (formData.get("email") as string)?.trim();
//     const phone = (formData.get("phone") as string)?.trim();
//     const date = formData.get("date") as string;
//     const time = formData.get("time") as string;

//     if (!validatePhone(phone)) {
//       alert("Please enter a valid phone number.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const res = await fetch("/api/appointments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           patientName,
//           email,
//           phone,
//           doctor: selectedDoctor.name,
//           doctorId: selectedDoctor.id,
//           specialty: selectedDoctor.specialty,
//           date,
//           time,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert("❌ Error: " + (data.error || `Status ${res.status}`));
//         return;
//       }

//       alert("✅ Appointment booked!");
//       setSelectedDoctor(null);
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert("❌ Network error. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="pt-12 max-w-7xl mx-auto px-4">
//       <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 mb-8 text-center animate-fade-in">
//         Find Your Doctor
//       </h1>

//       {/* Search bar */}
//       <div className="flex items-center gap-2 mb-12 animate-fade-in">
//         <input
//           type="text"
//           placeholder="Search by name or specialty..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-1 border border-emerald-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//         />
//       </div>

//       {/* Doctors grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
//         {doctors
//           .filter(
//             (d) =>
//               d.name.toLowerCase().includes(search.toLowerCase()) ||
//               d.specialty.toLowerCase().includes(search.toLowerCase())
//           )
//           .map((doctor) => (
//             <div
//               key={doctor.id}
//               className="bg-white border border-emerald-100 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 animate-zoom-in"
//             >
//               <img
//                 src={doctor.image}
//                 alt={doctor.name}
//                 className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-emerald-200"
//               />
//               <p className="text-lg font-bold text-emerald-700">{doctor.name}</p>
//               <p className="text-sm text-slate-600 mb-1">{doctor.specialty}</p>
//               <p className="text-sm text-slate-500">Experience: {doctor.experience}</p>
//               <p className="text-sm text-slate-500">Location: {doctor.location}</p>
//               <p className="text-sm text-slate-500">Availability: {doctor.availability}</p>
//               <p className="text-sm text-slate-600 mt-2">
//                 Fee: <span className="font-semibold">Rs {doctor.fees}</span>
//               </p>
//               <div className="flex justify-center mt-2">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <span
//                     key={i}
//                     className={`text-yellow-400 text-lg ${
//                       i < doctor.rating ? "opacity-100" : "opacity-30"
//                     }`}
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>
//               <button
//                 onClick={() => handleBookClick(doctor)}
//                 className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition duration-200"
//               >
//                 Book Appointment
//               </button>
//             </div>
//           ))}
//       </div>

//       {/* Popup appointment form */}
//       {selectedDoctor && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//           aria-modal="true"
//           role="dialog"
//         >
//           <div className="bg-white rounded-xl p-6 w-[85%] sm:w-full max-w-md animate-zoom-in relative">


//             <button
//               type="button"
//               onClick={() => setSelectedDoctor(null)}
//               className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
//               aria-label="Close"
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-bold mb-4 text-emerald-700">
//               Book Appointment with {selectedDoctor.name}
//             </h2>
//             <form onSubmit={handleSubmit}>
//               <label className="block mb-3">
//                 Your Name
//                 <input
//                   type="text"
//                   name="patientName"
//                   required
//                   className="w-full border rounded p-2 mt-1"
//                 />
//               </label>
//               <label className="block mb-3">
//                 Email
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   className="w-full border rounded p-2 mt-1"
//                 />
//               </label>
//               <label className="block mb-3">
//                 Phone
//                 <input
//                   type="tel"
//                   name="phone"
//                   required
//                   className="w-full border rounded p-2 mt-1"
//                   placeholder="e.g. +92-300-1234567"
//                 />
//               </label>
//               <label className="block mb-3">
//                 Date
//                 <input
//                   type="date"
//                   name="date"
//                   required
//                   className="w-full border rounded p-2 mt-1"
//                   min={new Date().toISOString().split("T")[0]}
//                   max={new Date(
//                     new Date().setFullYear(new Date().getFullYear() + 1)
//                   )
//                     .toISOString()
//                     .split("T")[0]}
//                 />
//               </label>
//               <label className="block mb-3">
//                 Time
//                 <input
//                   type="time"
//                   name="time"
//                   required
//                   className="w-full border rounded p-2 mt-1"
//                 />
//               </label>
//               <div className="flex justify-end mt-4 gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setSelectedDoctor(null)}
//                   className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-60"
//                 >
//                   {submitting ? "Booking..." : "Confirm"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
// import { useRouter, useSearchParams } from "next/navigation";

// type Doctor = {
//   id: string;
//   name: string;
//   specialty: string;
//   fees: number;
//   rating: number;
//   image: string;
//   experience: string;
//   location: string;
//   availability: string;
// };

// export default function DoctorsPage() {
//   const { isSignedIn } = useUser();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [search, setSearch] = useState("");
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   const doctorsList = useMemo<Doctor[]>(() => [
//     {
//       id: "doc_1",
//       name: "Dr. Ayesha Khan",
//       specialty: "Cardiologist",
//       fees: 1500,
//       rating: 5,
//       image: "/images/doctors/ayesha.jpg",
//       experience: "8 years",
//       location: "Karachi",
//       availability: "Mon-Fri, 9am-5pm",
//     },
//     {
//       id: "doc_2",
//       name: "Dr. Bilal Ahmed",
//       specialty: "Dermatologist",
//       fees: 1200,
//       rating: 4,
//       image: "/images/doctors/bilal.jpg",
//       experience: "6 years",
//       location: "Lahore",
//       availability: "Tue-Sat, 10am-4pm",
//     },
//     {
//       id: "doc_3",
//       name: "Dr. Sara Malik",
//       specialty: "Pediatrician",
//       fees: 1000,
//       rating: 5,
//       image: "/images/doctors/sara.jpg",
//       experience: "4 years",
//       location: "Karachi",
//       availability: "Mon-Fri, 11am-6pm",
//     },
//     {
//       id: "doc_4",
//       name: "Dr. Imran Ali",
//       specialty: "Orthopedic",
//       fees: 1800,
//       rating: 4,
//       image: "/images/doctors/imran.jpg",
//       experience: "10 years",
//       location: "Islamabad",
//       availability: "Mon-Thu, 9am-3pm",
//     },
//     {
//       id: "doc_5",
//       name: "Dr. Ahmed Sheikh",
//       specialty: "Dentist",
//       fees: 2000,
//       rating: 5,
//       image: "/images/doctors/ahmed.jpg",
//       experience: "7 years",
//       location: "Karachi",
//       availability: "Wed-Sun, 12pm-7pm",
//     },
//     {
//       id: "doc_6",
//       name: "Dr. Kamran Hussain",
//       specialty: "Neurologist",
//       fees: 2500,
//       rating: 5,
//       image: "/images/doctors/kamran.jpg",
//       experience: "12 years",
//       location: "Lahore",
//       availability: "Mon-Fri, 10am-5pm",
//     },
//     {
//       id: "doc_7",
//       name: "Dr. Faheem Noor",
//       specialty: "Psychiatrist",
//       fees: 2200,
//       rating: 4,
//       image: "/images/doctors/faheem.jpg",
//       experience: "5 years",
//       location: "Karachi",
//       availability: "Tue-Sat, 2pm-8pm",
//     },
//     {
//       id: "doc_8",
//       name: "Dr. Usman Raza",
//       specialty: "ENT Specialist",
//       fees: 1300,
//       rating: 4,
//       image: "/images/doctors/usman.jpg",
//       experience: "6 years",
//       location: "Islamabad",
//       availability: "Mon-Fri, 9am-1pm",
//     },
//   ], []);

//   useEffect(() => {
//     setDoctors(doctorsList);
//   }, [doctorsList]);

//   useEffect(() => {
//     const doctorId = searchParams?.get("id");
//     if (!doctorId || doctors.length === 0) return;
//     if (isSignedIn) {
//       const doctor = doctors.find((d) => d.id === doctorId);
//       if (doctor) setSelectedDoctor(doctor);
//     }
//   }, [isSignedIn, searchParams, doctors]);

//   const handleBookClick = (doctor: Doctor) => {
//     if (!isSignedIn) {
//       router.push(`/sign-in?redirect=/doctors&id=${doctor.id}`);
//       return;
//     }
//     setSelectedDoctor(doctor);
//   };

//   const validatePhone = (phone: string) => phone && phone.length >= 7;

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedDoctor || submitting) return;

//     const formData = new FormData(e.currentTarget);
//     const patientName = (formData.get("patientName") as string)?.trim();
//     const email = (formData.get("email") as string)?.trim();
//     const phone = (formData.get("phone") as string)?.trim();
//     const date = formData.get("date") as string;
//     const time = formData.get("time") as string;

//     if (!validatePhone(phone)) {
//       alert("Please enter a valid phone number.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const res = await fetch("/api/appointments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           patientName,
//           email,
//           phone,
//           doctor: selectedDoctor.name,
//           doctorId: selectedDoctor.id,
//           specialty: selectedDoctor.specialty,
//           date,
//           time,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         alert("❌ Error: " + (data.error || `Status ${res.status}`));
//         return;
//       }

//       alert("✅ Appointment booked!");
//       setSelectedDoctor(null);
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert("❌ Network error. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <SignedIn>
//         <div className="pt-12 max-w-7xl mx-auto px-4">
//           <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 mb-8 text-center animate-fade-in">
//             Find Your Doctor
//           </h1>

//           <div className="flex items-center gap-2 mb-12 animate-fade-in">
//             <input
//               type="text"
//               placeholder="Search by name or specialty..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="flex-1 border border-emerald-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
//             {doctors
//               .filter(
//                 (d) =>
//                   d.name.toLowerCase().includes(search.toLowerCase()) ||
//                   d.specialty.toLowerCase().includes(search.toLowerCase())
//               )
//               .map((doctor) => (
//                 <div
//                   key={doctor.id}
//                   className="bg-white border border-emerald-100 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 animate-zoom-in"
//                 >
//                   <img
//                     src={doctor.image}
//                     alt={doctor.name}
//                     className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-emerald-200"
//                   />
//                   <p className="text-lg font-bold text-emerald-700">{doctor.name}</p>
//                   <p className="text-sm text-slate-600 mb-1">{doctor.specialty}</p>
//                   <p className="text-sm text-slate-500">Experience: {doctor.experience}</p>
//                   <p className="text-sm text-slate-500">Location: {doctor.location}</p>
//                   <p className="text-sm text-slate-500">Availability: {doctor.availability}</p>
//                   <p className="text-sm text-slate-600 mt-2">
//                     Fee: <span className="font-semibold">Rs {doctor.fees}</span>
//                   </p>
//                   <div className="flex justify-center mt-2">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <span
//                         key={i}
//                         className={`text-yellow-400 text-lg ${
//                           i < doctor.rating ? "opacity-100" : "opacity-30"
//                         }`}
//                       >
//                         ★
//                       </span>
//                     ))}
//                   </div>
//                   <button
//                     onClick={() => handleBookClick(doctor)}
//                     className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition duration-200"
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               ))}
//           </div>

//           {/* Popup appointment form */}
//           {selectedDoctor && (
//   <div
//     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
//     aria-modal="true"
//     role="dialog"
//   >
//     <div className="bg-white rounded-xl w-full max-w-[24rem] sm:max-w-sm p-4 sm:p-5 mx-auto animate-zoom-in relative">
//       <button
//         type="button"
//         onClick={() => setSelectedDoctor(null)}
//         className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 text-sm"
//         aria-label="Close"
//       >
//         ✕
//       </button>
//       <h2 className="text-lg sm:text-xl font-semibold mb-4 text-emerald-700 text-center">
//         Book Appointment with {selectedDoctor.name}
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
//         <input
//           type="text"
//           name="patientName"
//           required
//           placeholder="Your Name"
//           className="w-full border rounded p-2 text-sm"
//         />
//         <input
//           type="email"
//           name="email"
//           required
//           placeholder="Email"
//           className="w-full border rounded p-2 text-sm"
//         />
//         <input
//           type="tel"
//           name="phone"
//           required
//           placeholder="+92-300-1234567"
//           className="w-full border rounded p-2 text-sm"
//         />
//         <input
//           type="date"
//           name="date"
//           required
//           className="w-full border rounded p-2 text-sm"
//           min={new Date().toISOString().split("T")[0]}
//           max={new Date(
//             new Date().setFullYear(new Date().getFullYear() + 1)
//           )
//             .toISOString()
//             .split("T")[0]}
//         />
//         <input
//           type="time"
//           name="time"
//           required
//           className="w-full border rounded p-2 text-sm"
//         />
//         <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
//           <button
//             type="button"
//             onClick={() => setSelectedDoctor(null)}
//             className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-100"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="px-4 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 disabled:opacity-60"
//           >
//             {submitting ? "Booking..." : "Confirm"}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}

        
//         </div>
//       </SignedIn>

//       <SignedOut>
//         <RedirectToSignIn redirectUrl="/doctors" />
//       </SignedOut>
//     </>
//   );
// }


"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  fees: number;
  rating: number;
  image: string;
  experience: string;
  location: string;
  availability: string;
};

function DoctorsPageContent() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const doctorsList = useMemo<Doctor[]>(() => [
    {
      id: "doc_1",
      name: "Dr. Ayesha Khan",
      specialty: "Cardiologist",
      fees: 1500,
      rating: 5,
      image: "/images/doctors/ayesha.jpg",
      experience: "8 years",
      location: "Karachi",
      availability: "Mon-Fri, 9am-5pm",
    },
    {
      id: "doc_2",
      name: "Dr. Bilal Ahmed",
      specialty: "Dermatologist",
      fees: 1200,
      rating: 4,
      image: "/images/doctors/bilal.jpg",
      experience: "6 years",
      location: "Lahore",
      availability: "Tue-Sat, 10am-4pm",
    },
    {
      id: "doc_3",
      name: "Dr. Sara Malik",
      specialty: "Pediatrician",
      fees: 1000,
      rating: 5,
      image: "/images/doctors/sara.jpg",
      experience: "4 years",
      location: "Karachi",
      availability: "Mon-Fri, 11am-6pm",
    },
    {
      id: "doc_4",
      name: "Dr. Imran Ali",
      specialty: "Orthopedic",
      fees: 1800,
      rating: 4,
      image: "/images/doctors/imran.jpg",
      experience: "10 years",
      location: "Islamabad",
      availability: "Mon-Thu, 9am-3pm",
    },
    {
      id: "doc_5",
      name: "Dr. Ahmed Sheikh",
      specialty: "Dentist",
      fees: 2000,
      rating: 5,
      image: "/images/doctors/ahmed.jpg",
      experience: "7 years",
      location: "Karachi",
      availability: "Wed-Sun, 12pm-7pm",
    },
    {
      id: "doc_6",
      name: "Dr. Kamran Hussain",
      specialty: "Neurologist",
      fees: 2500,
      rating: 5,
      image: "/images/doctors/kamran.jpg",
      experience: "12 years",
      location: "Lahore",
      availability: "Mon-Fri, 10am-5pm",
    },
    {
      id: "doc_7",
      name: "Dr. Faheem Noor",
      specialty: "Psychiatrist",
      fees: 2200,
      rating: 4,
      image: "/images/doctors/faheem.jpg",
      experience: "5 years",
      location: "Karachi",
      availability: "Tue-Sat, 2pm-8pm",
    },
    {
      id: "doc_8",
      name: "Dr. Usman Raza",
      specialty: "ENT Specialist",
      fees: 1300,
      rating: 4,
      image: "/images/doctors/usman.jpg",
      experience: "6 years",
      location: "Islamabad",
      availability: "Mon-Fri, 9am-1pm",
    },
  ], []);

  useEffect(() => setDoctors(doctorsList), [doctorsList]);

  useEffect(() => {
    const doctorId = searchParams?.get("id");
    if (doctorId && isSignedIn) {
      const doctor = doctors.find((d) => d.id === doctorId);
      if (doctor) setSelectedDoctor(doctor);
    }
  }, [isSignedIn, searchParams, doctors]);

  const handleBookClick = (doctor: Doctor) => {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect=/doctors&id=${doctor.id}`);
      return;
    }
    setSelectedDoctor(doctor);
  };

  const validatePhone = (phone: string) => phone && phone.length >= 7;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDoctor || submitting) return;

    const formData = new FormData(e.currentTarget);
    const patientName = (formData.get("patientName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;

    if (!validatePhone(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          email,
          phone,
          doctor: selectedDoctor.name,
          doctorId: selectedDoctor.id,
          specialty: selectedDoctor.specialty,
          date,
          time,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("❌ Error: " + (data.error || `Status ${res.status}`));
        return;
      }

      alert("✅ Appointment booked!");
      setSelectedDoctor(null);
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="pt-12 max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 mb-8 text-center">
            Find Your Doctor
          </h1>

          <div className="flex items-center gap-2 mb-12">
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-emerald-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {doctors
              .filter(
                (d) =>
                  d.name.toLowerCase().includes(search.toLowerCase()) ||
                  d.specialty.toLowerCase().includes(search.toLowerCase())
              )
              .map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white border border-emerald-100 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition hover:scale-105"
                >
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-emerald-200"
                  />
                  <p className="text-lg font-bold text-emerald-700">{doctor.name}</p>
                  <p className="text-sm text-slate-600 mb-1">{doctor.specialty}</p>
                  <p className="text-sm text-slate-500">Experience: {doctor.experience}</p>
                  <p className="text-sm text-slate-500">Location: {doctor.location}</p>
                  <p className="text-sm text-slate-500">Availability: {doctor.availability}</p>
                  <p className="text-sm text-slate-600 mt-2">
                    Fee: <span className="font-semibold">Rs {doctor.fees}</span>
                  </p>
                  <div className="flex justify-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-yellow-400 text-lg ${
                          i < doctor.rating ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                                    <button
                    onClick={() => handleBookClick(doctor)}
                    className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition duration-200"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
          </div>

          {/* Popup appointment form */}
          {selectedDoctor && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
              aria-modal="true"
              role="dialog"
            >
              <div className="bg-white rounded-xl w-full max-w-[24rem] sm:max-w-sm p-4 sm:p-5 mx-auto relative">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 text-sm"
                  aria-label="Close"
                >
                  ✕
                </button>
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-emerald-700 text-center">
                  Book Appointment with {selectedDoctor.name}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <input
                    type="text"
                    name="patientName"
                    required
                    placeholder="Your Name"
                    className="w-full border rounded p-2 text-sm"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                    className="w-full border rounded p-2 text-sm"
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+92-300-1234567"
                    className="w-full border rounded p-2 text-sm"
                  />
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full border rounded p-2 text-sm"
                    min={new Date().toISOString().split("T")[0]}
                    max={new Date(
                      new Date().setFullYear(new Date().getFullYear() + 1)
                    )
                      .toISOString()
                      .split("T")[0]}
                  />
                  <input
                    type="time"
                    name="time"
                    required
                    className="w-full border rounded p-2 text-sm"
                  />
                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDoctor(null)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {submitting ? "Booking..." : "Confirm"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/doctors" />
      </SignedOut>
    </>
  );
}

// ✅ Suspense wrapper
export default function DoctorsPage() {
  return (
    <Suspense fallback={<div>Loading doctors...</div>}>
      <DoctorsPageContent />
    </Suspense>
  );
}
