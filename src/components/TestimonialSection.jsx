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
    <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? 'text-[#FF900D]' : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${testimonial.author}&background=random`}
                      alt={testimonial.author}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
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