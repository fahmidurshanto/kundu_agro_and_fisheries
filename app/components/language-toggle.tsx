"use client";

import { useLanguage } from "./language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-xl bg-gray-100 p-1 border border-gray-200/60 shadow-inner">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
          language === "en"
            ? "bg-white text-primary shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
          language === "bn"
            ? "bg-white text-primary shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        BN
      </button>
    </div>
  );
}
