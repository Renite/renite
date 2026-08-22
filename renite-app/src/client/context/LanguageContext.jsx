/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_lang') || 'EN';
  });

  const changeLanguage = (selectedLang) => {
    setLang(selectedLang);
    localStorage.setItem('app_lang', selectedLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// Fallback default export just in case
export default LanguageProvider;