"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="bg-white text-gray-800 px-6 py-10 sm:py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-sky-700">Support</h1>
        <p className="text-gray-600 leading-relaxed">
          Need help with HealSync? Our team is here to assist you with any questions or issues.
          Whether you’re facing technical difficulties, have questions about your orders, or simply
          want guidance on using our platform, we’re committed to providing clear and timely support.
        </p>

        {/* Contact Options */}
        <div className="space-y-4 text-gray-700">
          <p>
            📧 Email:{" "}
            <Link
              href="https://mail.google.com/mail/?view=cm&fs=1&to=aqsakhan9849@gmail.com"
              target="_blank"
              className="underline text-emerald-600 hover:text-sky-600"
            >
              aqsakhan9849@gmail.com
            </Link>
          </p>
          <p>
            📱 WhatsApp:{" "}
            <Link
              href="https://wa.me/923410233773"
              target="_blank"
              className="underline text-emerald-600 hover:text-sky-600"
            >
              +92 341 0233773
            </Link>
          </p>
          <p>📍 Location: Karachi, Pakistan</p>
        </div>

        {/* Quick Response Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-2">Quick Response</h2>
          <p className="text-emerald-100">
            We aim to respond within 24 hours. For urgent queries, WhatsApp is the fastest way to reach us.
          </p>
        </motion.div>

        {/* Extra Content to Fill Page */}
        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-emerald-700">Frequently Asked Questions</h2>
          <p className="text-gray-700 leading-relaxed">
            Here are some common queries we receive from our users:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>How do I track my order status?</li>
            <li>What payment methods are supported on HealSync?</li>
            <li>Can I cancel or modify my order after placing it?</li>
            <li>How is my healthcare data kept secure?</li>
          </ul>
        </motion.section> */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-emerald-700">Our Commitment</h2>
          <p className="text-gray-700 leading-relaxed">
            At HealSync, we believe support is more than just solving problems — it’s about building
            trust. We’re committed to ensuring that every interaction leaves you confident and cared for.
          </p>
        </motion.section>
      </motion.div>
    </main>
  );
}
