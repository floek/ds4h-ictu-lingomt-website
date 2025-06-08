export class TranslationService {
  constructor() {
    this.baseUrl = 'https://group2-backend-nfk0.onrender.com/api';
  }

  async translate(sourceLang, targetLang, text) {
    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceLang,
          targetLang,
          text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Translation API error:', error);
      throw error;
    }
  }
}