export class TranslationService {
  constructor() {
    this.baseUrl = "https://mph61rz4ae.execute-api.us-east-1.amazonaws.com/conia_hack_prod_env";
  }

  async translate(sourceLang, targetLang, text) {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        // Handle different HTTP error status codes
        if (response.status === 404) {
          throw new Error("No translation found");
        } else if (response.status >= 500) {
          throw new Error("Server error - please try again later");
        } else {
          throw new Error(`Translation failed with status: ${response.status}`);
        }
      }

      const data = await response.json();

      // Parse the Lambda API response format
      if (data.translation && Array.isArray(data.translation) && data.translation.length > 0) {
        return {
          translation: data.translation[0].translation_text,
          originalText: data.original_text,
          message: data.message,
          matchType: "exact", // You can adjust this based on your needs
          fuzzyMatchScore: null,
          matchedWord: null,
        };
      } else {
        // Handle case where translation array is empty or missing
        throw new Error("No translation found");
      }

    } catch (error) {
      console.error("Translation API error:", error);
      
      // If it's a network error or parsing error, provide a user-friendly message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Network error - please check your internet connection");
      }
      
      // If it's a JSON parsing error
      if (error instanceof SyntaxError) {
        throw new Error("Invalid response from translation service");
      }
      
      // Re-throw other errors as-is
      throw error;
    }
  }

  // Optional: Add a method to check service health
  async checkHealth() {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "test",
        }),
      });
      
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  // Optional: Add a method for batch translations if needed in the future
  async translateBatch(texts) {
    const translations = [];
    
    for (const text of texts) {
      try {
        const result = await this.translate(null, null, text);
        translations.push(result);
      } catch (error) {
        translations.push({
          translation: `Error: ${error.message}`,
          originalText: text,
          error: true,
        });
      }
    }
    
    return translations;
  }
}