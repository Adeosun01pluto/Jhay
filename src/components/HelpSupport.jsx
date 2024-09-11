import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaBook, FaEnvelope } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { FaPhoneAlt } from 'react-icons/fa';
import { CiMail } from 'react-icons/ci';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-700 dark:text-gray-300 hover:text-[#FF900D] focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? <FaChevronUp className="text-[#FF900D]" /> : <FaChevronDown className="text-gray-400 dark:text-gray-500" />}
      </button>
      {isOpen && <p className="mt-2 text-gray-600 dark:text-gray-400">{answer}</p>}
    </div>
  );
};

const HelpSupport = () => {
  const faqData = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in the required information and follow the verification process."
    },
    {
      question: "What types of tokens can I trade on this platform?",
      answer: "Our platform supports a wide range of tokens, including major cryptocurrencies, DeFi tokens, NFTs, and more. You can view the full list of supported tokens on our Token Listings page."
    },
    {
      question: "How are transaction fees calculated?",
      answer: "Transaction fees vary depending on the type of token and the current network conditions. You can view the estimated fee before confirming any transaction. We strive to keep our fees competitive and transparent."
    },
  ];

  const guides = [
    { title: "Getting Started Guide", link: "/guides/getting-started" },
    { title: "How to Trade Tokens", link: "/guides/how-to-trade" },
    { title: "Understanding Market Orders", link: "/guides/market-orders" },
    { title: "Security Best Practices", link: "/guides/security-practices" },
  ];

  const ContactInfo = ({ icon, title, content }) => (
    <div className="flex items-start mb-6">
      <div className="mr-2 md:mr-4">{icon}</div>
      <div>
        <h3 className="text-sm md:text-lg font-semibold mb-1 dark:text-gray-200">{title}</h3>
        <p className="text-sm md:text-md text-gray-600 dark:text-gray-400">{content}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto md:px-4">
        <h1 className="text-xl md:text-3xl font-bold mb-8 text-center dark:text-gray-200 ">Help & Support</h1>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-md text-center font-semibold mb-6 text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:shadow-gray-700">
            {faqData.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* Contact Support Section */}
        <div className="min-h-screen py-6 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl md:text-3xl font-bold mb-8 text-center dark:text-gray-200 ">Contact Us</h1>
            <div className="bg-white rounded-lg shadow-md p-8 dark:bg-gray-800 dark:shadow-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-md text-center font-semibold mb-6 text-gray-800 dark:text-gray-200">Get in Touch</h2>
                  <ContactInfo
                    icon={<FiMapPin size={24} className="text-[#FF900D]" />}
                    title="Address"
                    content="123 Vehicle St, Automotive City, AC 12345"
                  />
                  <ContactInfo
                    icon={<FaPhoneAlt size={24} className="text-[#FF900D]" />}
                    title="Phone"
                    content="+1 (555) 123-4567"
                  />
                  <ContactInfo
                    icon={<CiMail size={24} className="text-[#FF900D]" />}
                    title="Email"
                    content="info@yourcompany.com"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Send Us a Message</h2>
                  <form>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                      <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF900D]" required />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF900D]" required />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
                      <textarea id="message" name="message" rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF900D]" required></textarea>
                    </div>
                    <button type="submit" className="bg-[#FF900D] text-white py-2 px-4 rounded-md hover:bg-[#FF900D]/90 transition-colors">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guides and Tutorials Section */}
        {/* <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Guides and Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <a
                key={index}
                href={guide.link}
                className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition duration-300 dark:bg-gray-800 dark:shadow-gray-700"
              >
                <FaBook className="text-3xl text-[#FF900D]" />
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200">{guide.title}</span>
              </a>
            ))}
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default HelpSupport;
