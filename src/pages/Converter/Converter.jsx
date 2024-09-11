import React from 'react';
import CurrencyConverter from './CurrencyConverter';

const Converter = () => {
  return (
    <div className="min-h-screen py-8 bg-white dark:bg-gray-800 ">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">Cryptocurrency Converter</h1>
        <div className="max-w-2xl mx-auto dark:bg-gray-900">
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
};

export default Converter;