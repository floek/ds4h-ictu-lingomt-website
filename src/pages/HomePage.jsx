import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import LanguageSelector from "../components/LanguageSelector/LanguageSelector";
import TranslationInput from "../components/TranslationInput/TranslationInput";
import CameraModal from "../components/CameraModal/CameraModal";
import { TranslationProvider, useTranslation } from "../contexts/TranslationContext";

const HomePageContent = () => {
  const {
       sourceLanguage,
      targetLanguage,
     } = useTranslation();

  // Handle retranslation data from history page
  useEffect(() => {
    const retranslateData = localStorage.getItem("retranslateData");
    if (retranslateData) {
      // This will be handled by TranslationProvider
      localStorage.removeItem("retranslateData");
    }
  }, []);

  // Function to get language display name
  const getLanguageDisplayName = (langCode) => {
    console.log("langCode : " + langCode);
    
    const languageNames = {
      'french': 'French',
      'english': 'English',
      'ghomala': 'Ghomala',
      'fulfulde': 'Fulfulde',
      // Add more language mappings as needed
    };
    return languageNames[langCode];
  };

  const sourceDisplayName = getLanguageDisplayName(sourceLanguage.name.toLowerCase() ?? "english");
  const targetDisplayName = getLanguageDisplayName(targetLanguage.name.toLowerCase() ?? "fulfulde");

  return (
    <Layout>
      <main className="main">
        <div className="logo-container">
          <h1 className="app-name">LinguoMT</h1>
          <h2 className="language-pair">
            <i className="fas fa-language"></i> Experience seamless
            translation:
            <span className="highlight">{sourceDisplayName} ⟷ {targetDisplayName}</span>
          </h2>
        </div>

        <div className="translator">
          <LanguageSelector />
          <TranslationInput />
        </div>
      </main>

      <footer>
        <p>
          LinguoMT provides not only full translation experience
          <span className="language-pair-footer"> {sourceDisplayName} - {targetDisplayName}</span>, but
          also dictionaries for every existing pairs of languages - online and
          for free.
        </p>
      </footer>

      <CameraModal />
    </Layout>
  );
};

const HomePage = () => {
  return (
    <TranslationProvider>
      <HomePageContent />
    </TranslationProvider>
  );
};

export default HomePage;