'use client';
import React, { useState, useEffect } from 'react';
import { SG, ID, MY, IN } from 'country-flag-icons/react/3x2'

const flags = {
  'IDR': <ID title="Indonesia" className="w-10 h-10" />,
  'SGD': <SG title="Singapore" className="w-10 h-10" />,
  'MYR': <MY title="Malaysia" className="w-10 h-10" />,
  'INR': <IN title="India" className="w-10 h-10" />,
}

const CurrencyConverterApp = () => {
  const [fromCurrency, setFromCurrency] = useState('IDR');
  const [toCurrency, setToCurrency] = useState('SGD');
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');

  const formatNumber = (num: string) => {
    // Remove existing commas and non-numeric characters (except decimal point)
    const cleanNum = num.replace(/[^0-9.]/g, '');
    // Format with commas
    const parts = cleanNum.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value.replace(/,/g, '')); // Store raw number without commas
    setDisplayAmount(formatNumber(value));
  };
  const [convertedAmount, setConvertedAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchExchangeRate = async (from: string, to: string) => {
    try {
      console.log(`Fetching exchange rate for ${from} -> ${to}...`);
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.NEXT_PUBLIC_API_KEY}&base_currency=${from}&currencies=${to}`
      );
      const data = await response.json();
      setExchangeRate(data.data[to]);
      setLastFetchTime(Date.now());
    } catch (error) {
      console.error('Failed to fetch exchange rate', error);
    }
  };

  useEffect(() => {
    const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes in milliseconds
    const currentTime = Date.now();

    // Fetch rates when currencies change or when cache expires
    if (currentTime - lastFetchTime >= CACHE_DURATION ||
      fromCurrency !== prevFromCurrency ||
      toCurrency !== prevToCurrency) {
      fetchExchangeRate(fromCurrency, toCurrency);
    }
  }, [fromCurrency, toCurrency, lastFetchTime]);

  // Track previous currency values
  const [prevFromCurrency, setPrevFromCurrency] = useState(fromCurrency);
  const [prevToCurrency, setPrevToCurrency] = useState(toCurrency);

  // Update previous values when currencies change
  useEffect(() => {
    setPrevFromCurrency(fromCurrency);
    setPrevToCurrency(toCurrency);
  }, [fromCurrency, toCurrency]);

  const convertCurrency = () => {
    if (amount && exchangeRate) {
      const numericAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
      const converted = (numericAmount * exchangeRate).toFixed(2);
      setConvertedAmount(formatNumber(converted));
    }
  };

  const swapCurrencies = () => {
    // Store current values first to use in the fetch
    const newFromCurrency = toCurrency;
    const newToCurrency = fromCurrency;

    // Update state with swapped values
    setFromCurrency(newFromCurrency);
    setToCurrency(newToCurrency);
    setAmount('');
    setDisplayAmount('');
    setConvertedAmount('');

    // Use the new values directly in the API call
    fetchExchangeRate(newFromCurrency, newToCurrency);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 dark:bg-blue-800 p-4 text-center">
          <h1 className="text-2xl font-bold text-white">Currency Converter</h1>
          <p className="text-blue-100 dark:text-blue-200">{fromCurrency} to {toCurrency}</p>
        </div>

        <div className="p-6">
          {/* From Currency */}
          <div className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
            <div className="mr-4">
              {flags[fromCurrency as keyof typeof flags]}
            </div>
            <div className="flex-grow">
              <select
                value={fromCurrency}
                onChange={(e) => {
                  setFromCurrency(e.target.value);
                  setConvertedAmount('');
                }}
                className="font-bold text-lg mr-2 text-gray-800 dark:text-gray-100 bg-transparent border-none outline-none cursor-pointer"
              >
                {Object.keys(flags).map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full text-right text-xl font-semibold bg-transparent outline-none
              text-gray-800 dark:text-gray-100 
              placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter amount"
              value={displayAmount}
              onChange={handleAmountChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                  convertCurrency();
                }
              }}
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-2">
            <button
              onClick={swapCurrencies}
              className="bg-gray-200 dark:bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center text-2xl text-gray-800 dark:text-gray-100"
            >
              ⇅
            </button>
          </div>

          {/* To Currency */}
          <div className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
            <div className="mr-4">
              {flags[toCurrency as keyof typeof flags]}
            </div>
            <div className="flex-grow">
              <select
                value={toCurrency}
                onChange={(e) => {
                  setToCurrency(e.target.value);
                  setConvertedAmount('');
                }}
                className="font-bold text-lg mr-2 text-gray-800 dark:text-gray-100 bg-transparent border-none outline-none cursor-pointer"
              >
                {Object.keys(flags).map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div className="w-full text-right text-xl font-semibold text-blue-600 dark:text-blue-400">
              {convertedAmount || '0.00'}
            </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={convertCurrency}
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition"
          >
            Convert
          </button>

          {/* Exchange Rate Info */}
          {exchangeRate && (
            <div className="text-center mt-4 text-gray-600 dark:text-gray-30">
              <p>1 {fromCurrency} = {parseFloat(Number(exchangeRate).toPrecision(4))} {toCurrency}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterApp;