import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6';

const Footer = () => {
  const menuItems = [
    {
      id: 1,
      label: 'Cooking',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Recipes', href: '/recipe' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
        { label: 'About Us', href: '/about' },
      ],
    },
    {
      id: 2,
      label: 'Legal',
      links: [
        { label: 'Terms', href: '/' },
        { label: 'Condition', href: '/' },
        { label: 'Cookies', href: '/' },
        { label: 'Copyright', href: '/' },
      ],
    },
    {
      id: 3,
      label: 'Follow',
      links: [
        { label: 'Facebook', href: '/' },
        { label: 'Twitter', href: '/' },
        { label: 'Instagram', href: '/' },
        { label: 'Youtube', href: '/' },
        { label: 'Telegram', href: '/' },
      ],
    },
  ];

  return (
    <footer className="bg-white no-print">
      <div className="footerWrapper px-4 md:px-8">
        <div className="footerTop grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 border-b border-[#E4E6F1] py-14">
          <div>
            <a href="/" className="text-3xl font-bold block mb-2">
              Foodie<span className="text-[#FF7426]">.</span>
            </a>
            <p className="text-[15px] text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae magnam recusandae labore fugit quis porro illum, ullam repellat saepe adipisci.
            </p>
          </div>

          {menuItems.map((section) => (
            <div key={section.id}>
              <h3 className="font-semibold text-lg text-black mb-3">{section.label}</h3>
              <ul className="flex flex-col gap-2 text-gray-700 font-medium">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="hover:underline hover:text-[#FF7967] transition-all duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footerBottom sm:py-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-sm text-gray-700">
            &copy; 2020 – All rights reserved. Powered by{' '}
            <span className="text-[#FF7426] font-semibold">Javed</span>
          </p>
          <div className="flex items-center gap-3 justify-center sm:justify-end">
            <FaFacebookF className="h-[30px] w-[30px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] transition-colors duration-300 cursor-pointer" />
            <FaTwitter className="h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] transition-colors duration-300 cursor-pointer" />
            <FaInstagram className="h-[35px] w-[35px] rounded p-1.5 hover:bg-[#E4E6F1] hover:text-[#FF7967] transition-colors duration-300 cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
