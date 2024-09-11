import React from 'react';
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    content: "This P2P exchange platform has revolutionized how I trade cryptocurrencies. It's fast, secure, and user-friendly!",
    author: "Alex Johnson",
    role: "Crypto Enthusiast",
    rating: 5,
  },
  {
    id: 2,
    content: "I've been using this platform for months now, and the customer support is top-notch. They're always there when I need help.",
    author: "Sarah Lee",
    role: "Day Trader",
    rating: 4,
  },
  {
    id: 3,
    content: "The variety of payment methods available makes it incredibly convenient. I highly recommend this platform to everyone!",
    author: "Mike Brown",
    role: "Investor",
    rating: 5,
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl md:text-3xl font-bold mb-8 text-center dark:text-gray-200 ">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="overflow-hidden shadow-lg rounded-lg transform hover:scale-105 transition-all duration-300 bg-white dark:bg-gray-800"
            >
              <div className="px-6 py-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mb-6 text-sm md:text-lg leading-relaxed text-gray-600 dark:text-gray-300">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full border-2 border-orange-400 dark:border-orange-600"
                      src={`https://ui-avatars.com/api/?name=${testimonial.author}&background=random`}
                      alt={testimonial.author}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-md md:text-lg font-semibold text-orange-600 dark:text-orange-400">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
