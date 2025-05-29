import React from 'react';
import './index.css';
import UploadExcel from './UploadExcel';
import logo from './assets/formatpro-logo.png';

function Header() {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-center">
      <img src={logo} alt="FormatPro logo" className="h-12 w-auto" />
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white shadow mt-8 p-4 text-center text-sm text-gray-500">
      © 2025 Machine Formatter — Tools That Work
    </footer>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <UploadExcel /> {/* 👈 This renders your full upload/export tool */}
      </main>
      <Footer />
    </div>
  );
}

export default App;