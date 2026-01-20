![POPIAH Banner](C:/Users/akaan/.gemini/antigravity/brain/fcbc1496-04bc-4ed4-a87f-b2095c5b7c19/popiah_banner_1768934770230.png)

# POPIAH

**POPIAH** is a clean, professional, and lightweight Point of Sale (POS) and Operations Management system. Built with modern web technologies, it is designed for speed, simplicity, and efficiency in small-scale food business operations.

---

## 🎯 Purpose
The goal of POPIAH is to provide business owners with a reliable, local-first tool to manage orders, products, and checkout processes without the overhead of complex cloud-based systems. It focuses on high-performance order entry and seamless data persistence.

## 🛠 Tech Stack
- **Frontend**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Data Persistence**: Browser `LocalStorage`

## 📁 Folder Structure
```text
/
├── components/       # Modular UI components (Ordering, Management, etc.)
├── constants.tsx     # Initial product data and app settings
├── types.ts          # TypeScript interfaces/types
├── utils.ts          # Helper functions (ID generation, formatting)
├── App.tsx           # Main application logic and state management
├── index.html        # Entry HTML file
└── vite.config.ts    # Vite configuration
```

## 🚀 How to Install and Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Steps
1. **Clone the repository** (or download the source code).
2. **Navigate to the project folder**:
   ```bash
   cd POPIAH
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open in your browser**: The terminal will provide a local URL (usually `http://localhost:5173`).

## 🔐 Environment Variables
POPIAH uses an `.env.local` file for configuration. Create this file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

---
> [!NOTE]
> This project is designed to run entirely in the browser. All data is saved locally on your device.
