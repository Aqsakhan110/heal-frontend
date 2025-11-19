"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <main className="bg-white text-gray-800 px-6 py-10"> {/* reduced gap for footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-extrabold text-emerald-700 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 leading-relaxed">
          At HealSync, your privacy is our priority. This Privacy Policy explains how we collect, use,
          and protect your personal and healthcare information. By using our services, you consent to
          the practices described below.
        </p>

        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-teal-700">1. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            We collect information you provide during registration, purchases, and communication with
            our support team. This may include your name, contact details, medical preferences, and
            payment information. We also gather technical data such as device type, browser, and usage
            patterns to improve our services.
          </p>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-teal-700">2. How We Use Your Data</h2>
          <p className="text-gray-700 leading-relaxed">
            Your data is used to process orders, personalize your experience, and provide secure
            healthcare services. We may also use anonymized data for analytics to improve our platform.
            We never sell or share your personal information with third parties without your consent.
          </p>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-teal-700">3. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            HealSync uses industry-standard encryption and secure servers to protect your information.
            Access to sensitive data is restricted to authorized personnel only. We regularly audit our
            systems to maintain compliance with healthcare and e-commerce standards.
          </p>
        </motion.section>

        {/* Section 4 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-teal-700">4. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You have the right to access, update, or delete your personal data at any time. You may
            also opt out of marketing communications. For assistance, contact our support team at
            <span className="text-emerald-600 font-medium"> support@healsync.com</span>.
          </p>
        </motion.section>

        {/* Section 5 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold text-teal-700">5. Updates to Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy to reflect changes in our practices or legal requirements.
            Updates will be posted on this page, and continued use of HealSync indicates acceptance of
            the revised policy.
          </p>
        </motion.section>

        {/* Closing */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-gray-600 leading-relaxed">
            Protecting your privacy is central to our mission. Thank you for trusting HealSync with your
            healthcare journey.
          </p>
        </motion.section>
      </motion.div>
    </main>
  );
}

