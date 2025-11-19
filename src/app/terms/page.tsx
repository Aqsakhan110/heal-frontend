"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <main className="bg-white text-gray-800 px-6 py-10"> {/* reduced py from 16 → 10 for less gap */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-extrabold text-teal-700 mb-4">Terms of Service</h1>
        <p className="text-gray-600 leading-relaxed">
          Welcome to HealSync. By accessing or using our platform, you agree to comply with and be bound by
          the following Terms of Service. Please read them carefully, as they outline your rights,
          responsibilities, and the standards we uphold to ensure a secure and trustworthy healthcare
          experience.
        </p>

        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-emerald-700">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By creating an account or using HealSync services, you confirm that you are at least 18 years old
            and legally capable of entering into agreements. Continued use of our platform constitutes
            acceptance of any updated terms.
          </p>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-emerald-700">2. User Responsibilities</h2>
          <p className="text-gray-700 leading-relaxed">
            You agree to provide accurate information during registration and while using our services. You
            are responsible for maintaining the confidentiality of your account credentials and for all
            activities conducted under your account.
          </p>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-emerald-700">3. Healthcare Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed">
            HealSync provides healthcare e-commerce and informational services. We do not replace medical
            advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical
            concerns.
          </p>
        </motion.section>

        {/* Section 4 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-emerald-700">4. Payments & Refunds</h2>
          <p className="text-gray-700 leading-relaxed">
            Payments are processed securely via Stripe or Cash on Delivery. Refunds are subject to our
            refund policy and may require proof of purchase. HealSync reserves the right to refuse or cancel
            orders in cases of fraud or misuse.
          </p>
        </motion.section>

        {/* Section 5 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-emerald-700">5. Updates to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            HealSync may update these Terms of Service periodically. We encourage users to review them
            regularly. Continued use of the platform after updates indicates acceptance of the revised terms.
          </p>
        </motion.section>

        {/* Closing */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-gray-600 leading-relaxed">
            Thank you for choosing HealSync. Together, we’re building a safer, more accessible healthcare
            ecosystem across Pakistan.
          </p>
        </motion.section>
      </motion.div>
    </main>
  );
}
