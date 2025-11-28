"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

// --- Type Definition ---
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

// --- Framer Motion Variants (Optimized for Performance) ---

// 💡 FIX 1: Simplified container, only controls stagger speed.
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            // Faster stagger speed (50ms between items)
            staggerChildren: 0.05, 
        },
    },
};

// 💡 FIX 2: Simplified card animation. Removed complex 'spring', 'x' movement, and heavy 'scale' for entrance.
const cardVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 20, // Simple vertical slide-in
    }, 
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "tween", // Faster animation type
            duration: 0.4, 
        },
    },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 20 } },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.3 } },
};

// --- Component ---

function DoctorsPageContent() {
    const { isSignedIn } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [search, setSearch] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Doctor data array (kept locally as it's hardcoded)
    const doctorsList = useMemo<Doctor[]>(() => [
        { id: "doc_1", name: "Dr. Ayesha Khan", specialty: "Cardiologist", fees: 1500, rating: 5, image: "/images/doctors/ayesha.jpg", experience: "8 years", location: "Karachi", availability: "Mon-Fri, 9am-5pm" },
        { id: "doc_2", name: "Dr. Bilal Ahmed", specialty: "Dermatologist", fees: 1200, rating: 4, image: "/images/doctors/bilal.jpg", experience: "6 years", location: "Lahore", availability: "Tue-Sat, 10am-4pm" },
        { id: "doc_3", name: "Dr. Sara Malik", specialty: "Pediatrician", fees: 1000, rating: 5, image: "/images/doctors/sara.jpg", experience: "4 years", location: "Karachi", availability: "Mon-Fri, 11am-6pm" },
        { id: "doc_4", name: "Dr. Imran Ali", specialty: "Orthopedic", fees: 1800, rating: 4, image: "/images/doctors/imran.jpg", experience: "10 years", location: "Islamabad", availability: "Mon-Thu, 9am-3pm" },
        { id: "doc_5", name: "Dr. Ahmed Sheikh", specialty: "Dentist", fees: 2000, rating: 5, image: "/images/doctors/ahmed.jpg", experience: "7 years", location: "Karachi", availability: "Wed-Sun, 12pm-7pm" },
        { id: "doc_6", name: "Dr. Kamran Hussain", specialty: "Neurologist", fees: 2500, rating: 5, image: "/images/doctors/kamran.jpg", experience: "12 years", location: "Lahore", availability: "Mon-Fri, 10am-5pm" },
        { id: "doc_7", name: "Dr. Faheem Noor", specialty: "Psychiatrist", fees: 2200, rating: 4, image: "/images/doctors/faheem.jpg", experience: "5 years", location: "Karachi", availability: "Tue-Sat, 2pm-8pm" },
        { id: "doc_8", name: "Dr. Usman Raza", specialty: "ENT Specialist", fees: 1300, rating: 4, image: "/images/doctors/usman.jpg", experience: "6 years", location: "Islamabad", availability: "Mon-Fri, 9am-1pm" },
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
            // Redirect to sign-in, maintaining doctor context for post-login
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

            // Mock API Call (Replace with actual fetch to your backend)
            // Simulating API call delay
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            // Assume success for this mock example
            alert(`✅ Appointment confirmed with ${selectedDoctor.name} we will inform you further!`);
            setSelectedDoctor(null);
            
        } catch (err) {
            console.error("Booking error:", err);
            alert("❌ Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <SignedIn>
                <div className="pt-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Animated Heading (Simple animation, fast loading) */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 mb-6 sm:mb-8 text-center"
                    >
                        Expert Medical Directory
                    </motion.h1>

                    {/* Animated Search Filter (Simple animation, fast loading) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative mb-10 sm:mb-12 flex items-center group"
                    >
                        <span className="absolute left-4 text-teal-500 transition-colors group-focus-within:text-teal-700">
                            🔍
                        </span>
                        <input
                            type="text"
                            id="doctor-search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="peer w-full border border-slate-300 rounded-lg py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition duration-200 placeholder-transparent"
                            placeholder="Search by name or specialty..."
                        />
                        <label
                            htmlFor="doctor-search"
                            className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none transition-all duration-200
                                             peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-teal-600"
                        >
                            Search by name or specialty...
                        </label>
                    </motion.div>


                    {/* Doctor Cards Container */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16"
                        variants={containerVariants}
                        // 💡 FIX 3: Removed initial="hidden" and animate="visible" from the container.
                        // We rely on staggerChildren in containerVariants and initial/animate on children.
                    >
                        {doctors
                            .filter(d =>
                                d.name.toLowerCase().includes(search.toLowerCase()) ||
                                d.specialty.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((doctor, index) => (
                                <motion.div
                                    key={doctor.id}
                                    className="bg-white border border-teal-100 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center transition hover:shadow-xl hover:border-teal-200"
                                    variants={cardVariants} // Use the simplified, non-dynamic variant
                                    initial="hidden" // 💡 FIX 4: Apply initial/animate to the individual card
                                    animate="visible"
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" }} 
                                >
                                    {/* Circular image (using next/image) */}
                                    <div className="w-28 h-28 sm:w-36 sm:h-36 mb-4 relative rounded-full overflow-hidden border-4 border-teal-300 shadow-md"> 
                                        <Image
                                            src={doctor.image}
                                            alt={doctor.name}
                                            fill // Makes the image fill the parent div
                                            className="object-cover" 
                                            sizes="(max-width: 640px) 100vw, 33vw"
                                            // 💡 Optimization: Added priority for above-the-fold content
                                            priority={index < 4} 
                                        />
                                    </div>
                                    
                                    <p className="text-base sm:text-lg font-bold text-teal-700">{doctor.name}</p>
                                    <p className="text-xs sm:text-sm text-slate-600 mb-1">{doctor.specialty}</p>
                                    <p className="text-xs text-slate-500">Experience: {doctor.experience}</p>
                                    <p className="text-xs text-slate-500">Location: {doctor.location}</p>
                                    <p className="text-xs text-slate-500">Availability: {doctor.availability}</p>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-2">
                                        Fee: <span className="font-semibold">Rs {doctor.fees}</span>
                                    </p>
                                    <div className="flex justify-center mt-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={`text-yellow-400 text-lg ${i < doctor.rating ? "opacity-100" : "opacity-30"}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleBookClick(doctor)}
                                        className="mt-4 bg-teal-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm hover:bg-teal-700 transition duration-200"
                                    >
                                        Book Appointment
                                    </button>
                                </motion.div>
                            ))}
                    </motion.div>

                    {/* Appointment Popup (Animated) */}
                    {selectedDoctor && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="bg-white rounded-xl w-full max-w-[20rem] sm:max-w-sm p-4 sm:p-5 mx-auto relative"
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelectedDoctor(null)}
                                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 text-sm"
                                >
                                    ✕
                                </button>

                                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-teal-700 text-center">
                                    Book Appointment with {selectedDoctor.name}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                    <input type="text" name="patientName" required placeholder="Your Name" className="w-full border rounded p-2 text-sm" />
                                    <input type="email" name="email" required placeholder="Email" className="w-full border rounded p-2 text-sm" />
                                    <input type="tel" name="phone" required placeholder="+92-300-1234567" className="w-full border rounded p-2 text-sm" />
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        className="w-full border rounded p-2 text-sm"
                                        min={new Date().toISOString().split("T")[0]}
                                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]}
                                    />
                                    <input type="time" name="time" required className="w-full border rounded p-2 text-sm" />

                                    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                                        <button type="button" onClick={() => setSelectedDoctor(null)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-100">
                                            Cancel
                                        </button>

                                        <button type="submit" disabled={submitting} 
                                            className="px-4 py-2 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 disabled:opacity-60"
                                        >
                                            {submitting ? "Booking..." : "Confirm"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </SignedIn>

            <SignedOut>
                <RedirectToSignIn redirectUrl="/doctors" />
            </SignedOut>
        </>
    );
}

// --- Suspense wrapper ---
export default function DoctorsPage() {
    return (
        <Suspense fallback={<div>Loading doctors...</div>}>
            <DoctorsPageContent />
        </Suspense>
    );
}