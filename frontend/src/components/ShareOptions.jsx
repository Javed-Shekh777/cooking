


import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedinIn, FaTelegramPlane, FaEnvelope } from 'react-icons/fa';




export default function ShareOptions({ link, onClose }) {
    const [linkColor,setLinkColor] = useState('');

  const copyToClipboard = () => {
    setLinkColor("bg-blue-400 text-white");
    setTimeout(()=>{setLinkColor('')},1000);
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="fixed inset-0 z-50  bg-[rgba(0,0,0,0.3)] bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto relative ">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-black text-4xl"
        >
          &times;
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-2">Share</h2>
        <hr className="border-t-2 border-gray-200 mb-6 w-24 mx-auto" />

        {/* Shareable Link */}
        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 mb-6">
          <span className={`text-sm ${linkColor ? linkColor : "text-gray-700"} truncate`}>{link}</span>
          <button
            onClick={copyToClipboard}
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            {linkColor?"Copied":"Copy"}
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          <SocialIcon icon={<FaFacebookF />} label="Facebook" />
          <SocialIcon icon={<FaTwitter />} label="Twitter" />
          <SocialIcon icon={<FaWhatsapp />} label="WhatsApp" />
          <SocialIcon icon={<FaLinkedinIn />} label="LinkedIn" />
          <SocialIcon icon={<FaTelegramPlane />} label="Telegram" />
          <SocialIcon icon={<FaEnvelope />} label="Email" />
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ icon, label }) {
  return (
    <div
      className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer"
      title={label}
    >
      <span className="text-xl text-gray-700">{icon}</span>
    </div>
  );
}
