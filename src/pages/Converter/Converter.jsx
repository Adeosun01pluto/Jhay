import React from 'react';
import CurrencyConverter from './CurrencyConverter';

const Converter = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Cryptocurrency Converter</h1>
        <div className="max-w-2xl mx-auto">
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
};

export default Converter;