import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "923410233773"; // your WhatsApp number
  const url = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50"
    >
      <FaWhatsapp size={24} />
    </a>
  );
};

export default WhatsAppButton;
