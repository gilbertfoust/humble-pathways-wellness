import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (en: string, es: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("en");
  const toggleLang = useCallback(() => setLang((l) => (l === "en" ? "es" : "en")), []);
  const t = useCallback((en: string, es: string) => (lang === "en" ? en : es), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
