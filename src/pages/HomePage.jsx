import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';
import TranslationInput from '../components/TranslationInput/TranslationInput';
import CameraModal from '../components/CameraModal/CameraModal';
import { TranslationProvider } from '../contexts/TranslationContext';

const HomePage = () => {
  const navigate = useNavigate();

  // Handle retranslation data from history page
  useEffect(() => {
    const retranslateData = localStorage.getItem('retranslateData');
    if (retranslateData) {
      // This will be handled by TranslationProvider
      localStorage.removeItem('retranslateData');
    }
  }, []);

  return (
    <TranslationProvider>
      <Layout>
        <main className="main">
          <div className="logo-container">
            <h1 className="app-name">CamMT</h1>
            <h2 className="language-pair">
              <i className="fas fa-language"></i> Experience seamless translation:
              <span className="highlight">French ⟷ Ghomala</span>
            </h2>
          </div>

          <div className="translator">
            <LanguageSelector />
            <TranslationInput />
          </div>
        </main>

        <footer>
          <p>
            CamMT provides not only full translation experience
            <span className="language-pair-footer">French - Ghomala</span>, but also
            dictionaries for every existing pairs of languages - online and for
            free.
          </p>
        </footer>

        <CameraModal />
      </Layout>
    </TranslationProvider>
  );
};

export default HomePage;