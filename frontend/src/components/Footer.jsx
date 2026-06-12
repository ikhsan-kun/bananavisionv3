import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="./uhn.png" alt="Universitas Harkat Negeri" className="h-10 object-contain" />
            <span className="text-sm text-gray-500">Universitas Harkat Negeri</span>
          </div> 
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2026 BananaVision Inc. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <button className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </button>
            <button className="hover:text-gray-900 transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
