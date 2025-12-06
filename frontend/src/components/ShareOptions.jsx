


import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedinIn, FaTelegramPlane, FaEnvelope } from 'react-icons/fa';




export default function ShareOptions({ link, onClose }) {
  const [linkColor, setLinkColor] = useState('');

  const copyToClipboard = () => {
    setLinkColor("bg-blue-400 text-white");
    setTimeout(() => { setLinkColor('') }, 1000);
    navigator.clipboard.writeText(link);
  };


  const shareOn = (platform, url) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;

      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        break;

      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
        break;

      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
        break;

      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
        break;

      case "email":
        shareUrl = `mailto:?subject=Check this out&body=${encodeURIComponent(url)}`;
        break;

      default:
        return;
    }

    window.open(shareUrl, "_blank");
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
            {linkColor ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          <SocialIcon icon={<FaFacebookF />} label="Facebook" onClick={() => shareOn('facebook', link)} />
          <SocialIcon icon={<FaTwitter />} label="Twitter" onClick={() => shareOn('twitter', link)} />
          <SocialIcon icon={<FaWhatsapp />} label="WhatsApp" onClick={() => shareOn('whatsapp', link)} />
          <SocialIcon icon={<FaLinkedinIn />} label="LinkedIn" onClick={() => shareOn('linkedin', link)} />
          <SocialIcon icon={<FaTelegramPlane />} label="Telegram" onClick={() => shareOn('telegram', link)} />
          <SocialIcon icon={<FaEnvelope />} label="Email" onClick={() => shareOn('email', link)} />

        </div>
      </div>
    </div>
  );
}

function SocialIcon({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 
      flex items-center justify-center hover:bg-gray-200 cursor-pointer"
      title={label}
    >
      <span className="text-xl text-gray-700">{icon}</span>
    </div>
  );
}

