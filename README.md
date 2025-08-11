# Konvert

A sleek, modern currency conversion app built with Next.js and React. Convert between IDR, SGD, MYR, and INR currencies with real-time exchange rates.

![Konvert App](https://github.com/jatinshah/konvert/raw/main/public/screenshot.png)

## Features

- 💱 Real-time currency conversion
- 🔄 Swap currencies with one click
- 🏳️ Visual currency representation with country flags
- 🌓 Light and dark mode support
- 📱 Responsive design for all devices
- 🔢 Number formatting with thousands separators

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Free Currency API
- Country Flag Icons

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- API key from [Free Currency API](https://freecurrencyapi.com/)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/konvert.git
   cd konvert
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory and add your API key
   ```
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select your source currency (From)
2. Enter the amount you want to convert
3. Select your target currency (To)
4. Click the "Convert" button
5. View the converted amount and exchange rate

## License

MIT

## Acknowledgements

- Built with the help of AI assistants
- Currency data provided by [Free Currency API](https://freecurrencyapi.com/)
- Country flags from [country-flag-icons](https://www.npmjs.com/package/country-flag-icons)