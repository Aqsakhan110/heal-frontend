// "use client"; import { motion } from "framer-motion"; import Link from "next/link"; import Image from "next/image"; export default function HomePage() { return (<main className="bg-white min-h-screen text-gray-900 px-8 md:px-16"> {/* HERO */} <section id="hero" className="pt-40 pb-12 flex flex-col md:flex-row items-center gap-12" > {/* Left Side */} <motion.div suppressHydrationWarning initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, type: "spring" }} className="flex-1 text-left" > <motion.h1 suppressHydrationWarning initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, type: "spring" }} className="text-3xl md:text-4xl font-extrabold text-emerald-700 leading-snug" > Accessible healthcare. Anytime. Anywhere. </motion.h1> <motion.p suppressHydrationWarning initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 text-lg text-gray-600 max-w-xl" > HealSync brings verified doctors and partner pharmacies together — book appointments, consult with specialists, and order medicines for home delivery. </motion.p> {/* CTA Buttons */} <motion.div suppressHydrationWarning initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, type: "spring" }} className="mt-6 flex gap-5" > <Link href="/doctors" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition" > Find a Doctor </Link> <Link href="/medicines" className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition" > Order Medicines </Link> </motion.div> </motion.div> {/* Right Side Card */} <motion.div suppressHydrationWarning initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, type: "spring" }} className="flex-1 rounded-xl shadow-lg p-6 bg-white relative overflow-hidden group" > {/* Animated gradient layer */} <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-0 group-hover:opacity-100 animate-gradient-x transition-opacity duration-700 rounded-xl"></div> {/* Content */} <div className="relative z-10"> <h3 className="text-xl font-bold text-emerald-700 mb-3 group-hover:text-white"> How it works </h3> <ul className="space-y-2 text-gray-600 text-sm group-hover:text-white"> <li>✔ Search and book appointments with verified doctors.</li> <li>✔ View each doctor's schedule and choose a convenient slot.</li> <li>✔ Order medicines from partner pharmacies with doorstep delivery.</li> </ul> </div> </motion.div> </section> {/* FEATURE CATEGORIES */} <section className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> {[{ title: "Medicines", img: "/assets/med1.jpg" }, { title: "Doctors", img: "/assets/doctor1.jpg" }, { title: "Pharmacies", img: "/assets/doctor2.jpg" }, { title: "Reorders", img: "/assets/med2.jpg" },].map((item, idx) => (<motion.div key={item.title} suppressHydrationWarning initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.2, type: "spring" }} whileHover={{ scale: 1.08, rotate: 1 }} viewport={{ once: true }} className="rounded-xl overflow-hidden shadow-md bg-white" > <Image src={item.img} alt={item.title} width={400} height={250} className="w-full h-48 object-cover" /> <div className="p-4 text-center"> <h3 className="text-lg font-bold text-emerald-700">{item.title}</h3> </div> </motion.div>))} </section> {/* ABOUT SECTION */} <section id="about" className="bg-gray-50 py-12 flex flex-col md:flex-row items-center justify-center gap-12 pr-12" > {/* Text */} <motion.div suppressHydrationWarning initial={{ opacity: 0, x: -120 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, type: "spring" }} className="flex-1 text-center md:text-left" > <h2 className="text-3xl font-bold text-emerald-700 mb-4"> About HealSync </h2> <p className="max-w-2xl text-gray-700 leading-relaxed text-base"> At HealSync, we believe healthcare should be simple, secure, and accessible for everyone. Our platform connects patients with verified doctors and trusted pharmacies, ensuring quality care and authentic medicines. With a focus on convenience and reliability, HealSync is redefining how healthcare works in Pakistan. </p> </motion.div> {/* MP4 Video */} <motion.div suppressHydrationWarning initial={{ opacity: 0, x: 120, scale: 0.8 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 1, type: "spring" }} className="flex-1 flex justify-center" > <video src="/about.mp4" autoPlay loop muted playsInline className="w-80 h-80 rounded-xl shadow-md" /> </motion.div> </section> {/* CONTACT SECTION */} <section id="contact" className="bg-gray-100 py-12 flex flex-col md:flex-row items-center justify-center gap-12" > {/* MP4 Video */} <motion.div suppressHydrationWarning initial={{ opacity: 0, x: -120, scale: 0.8 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 1, type: "spring" }} className="flex-1 flex justify-center order-2 md:order-1" > <video src="/Contact.mp4" autoPlay loop muted playsInline className="w-80 h-80 rounded-xl shadow-md" /> </motion.div> {/* Text */} <motion.div suppressHydrationWarning initial={{ opacity: 0, x: 120 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, type: "spring" }} className="flex-1 text-center md:text-left order-1 md:order-2" > <h2 className="text-3xl font-bold text-emerald-700 mb-4"> Get in Touch </h2> <p className="max-w-2xl text-gray-700 leading-relaxed text-base"> Have questions or need assistance? Our support team is here to help. Whether it’s booking an appointment or tracking your medicine order, we’re just a call or message away. </p> <motion.div suppressHydrationWarning initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: "spring" }} className="mt-6 flex gap-4 justify-center md:justify-start" > <Link href="https://wa.me/923410233773" target="_blank" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow-md transition text-base font-semibold" > WhatsApp </Link> <Link href="/contact" className="border border-emerald-600 text-emerald-600 px-5 py-2 rounded-lg shadow-md transition text-base font-semibold hover:bg-emerald-600 hover:text-white" > Contact Form </Link> </motion.div> </motion.div> </section> </main>); }
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
    return (
        <main className="bg-white min-h-screen text-gray-900 px-4 sm:px-8 lg:px-16">
            <section
                id="hero"
                className="pt-8 sm:pt-12 lg:pt-16 pb-12 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto"
            >


                {/* Left Side */}
                <motion.div
                    suppressHydrationWarning
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="flex-1 text-center md:text-left"
                >
                    <motion.h1
                        suppressHydrationWarning
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-emerald-700 leading-snug"
                    >
                        Accessible healthcare. Anytime. Anywhere.
                    </motion.h1>
                    <motion.p
                        suppressHydrationWarning
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto md:mx-0"
                    >
                        HealSync brings verified doctors and partner pharmacies together — book appointments,
                        consult with specialists, and order medicines for home delivery.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        suppressHydrationWarning
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, type: "spring" }}
                        className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                    >
                        <Link
                            href="/doctors"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition"
                        >
                            Find a Doctor
                        </Link>
                        <Link
                            href="/medicines"
                            className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition"
                        >
                            Order Medicines
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Side Card */}
                <motion.div
                    suppressHydrationWarning
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="flex-1 rounded-xl shadow-lg p-6 bg-white relative overflow-hidden group max-w-md w-full"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-0 group-hover:opacity-100 animate-gradient-x transition-opacity duration-700 rounded-xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3 group-hover:text-white">
                            How it works
                        </h3>
                        <ul className="space-y-2 text-gray-600 text-xs sm:text-sm group-hover:text-white">
                            <li>✔ Search and book appointments with verified doctors.</li>
                            <li>✔ View each doctor's schedule and choose a convenient slot.</li>
                            <li>✔ Order medicines from partner pharmacies with doorstep delivery.</li>
                        </ul>
                    </div>
                </motion.div>
            </section>

            {/* FEATURE CATEGORIES */}
            <section className="pt-6 sm:pt-8 lg:pt-12 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Medicines", img: "/assets/med1.jpg", href: "/medicines" },
                    { title: "Doctors", img: "/assets/doctor1.jpg", href: "/doctors" },
                    { title: "Reorders", img: "/assets/med2.jpg", href: "/medicines" },
                    { title: "Healthcare Team", img: "/assets/doctor2.jpg", href: "/doctors" }, // pharmacy → medicines
                     // you can create /reorders page
                ].map((item, idx) => (
                    <Link key={item.title} href={item.href} className="block">
                        <motion.div
                            suppressHydrationWarning
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2, type: "spring" }}
                            whileHover={{ scale: 1.08, rotate: 1 }}
                            viewport={{ once: true }}
                            className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col h-auto sm:h-[280px] lg:h-[360px] cursor-pointer"
                        >
                            <Image
                                src={item.img}
                                alt={item.title}
                                loading="eager"
                                width={400}
                                height={250}
                                className="w-full aspect-[4/3] object-cover object-center"
                            />
                            <div className="p-4 text-center">
                                <h3 className="text-base sm:text-lg font-bold text-emerald-700">
                                    {item.title}
                                </h3>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </section>


            {/* ABOUT SECTION */}
            <section
                id="about"
                className="bg-gray-50 pt-6 pb-12 flex flex-col md:flex-row items-center justify-center gap-12 px-4 sm:px-8 lg:px-16"

            >
                {/* Text */}
                <motion.div
                    suppressHydrationWarning
                    initial={{ opacity: 0, x: -120 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="flex-1 text-center md:text-left"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-700 mb-4">
                        About HealSync
                    </h2>
                    <p className="max-w-2xl text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg mx-auto md:mx-0">
                        At HealSync, we believe healthcare should be simple, secure, and accessible for everyone.
                        Our platform connects patients with verified doctors and trusted pharmacies, ensuring
                        quality care and authentic medicines. With a focus on convenience and reliability,
                        HealSync is redefining how healthcare works in Pakistan.
                    </p>
                </motion.div>

                {/* MP4 Video */}
                <motion.div
                    suppressHydrationWarning
                    initial={{ opacity: 0, x: 120, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="flex-1 flex justify-center"
                >
                    <video
                        src="/about.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-64 h-64 sm:w-80 sm:h-80 rounded-xl shadow-md"
                    />
                </motion.div>
            </section>

            {/* CONTACT SECTION */}
            <section
                id="contact"
                className="bg-gray-100 py-12 flex flex-col md:flex-row items-center justify-center gap-12 px-4 sm:px-8 lg:px-16"
            >
                {/* MP4 Video */}
                <motion.div
                    suppressHydrationWarning
                    initial={{ opacity: 0, x: -120, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="flex-1 flex justify-center order-2 md:order-1"
                >
                    <video
                        src="/Contact.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-64 h-64 sm:w-80 sm:h-80 rounded-xl shadow-md"
                    />
                </motion.div>

                {/* Text */}
                <motion.div
                    suppressHydrationWarning
                    initial={{ opacity: 0, x: 120 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="flex-1 text-center md:text-left order-1 md:order-2"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-700 mb-4">
                        Get in Touch
                    </h2>
                    <p className="max-w-2xl text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg mx-auto md:mx-0">
                        Have questions or need assistance? Our support team is here to help. Whether it’s booking
                        an appointment or tracking your medicine
                    </p>
                </motion.div>
            </section>
        </main>
    );
}


