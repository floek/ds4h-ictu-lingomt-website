import combinedDictionaries from './combined_dictionaries.json';

export class TranslationService {
  constructor() {
    this.baseUrl = "https://mph61rz4ae.execute-api.us-east-1.amazonaws.com/conia_hack_prod_env";
    this.dictionaries = combinedDictionaries;
  }

  // New method to perform local lookup
  localLookup(sourceLang, targetLang, text) {
    const searchText = text.trim().toLowerCase();
    
    // Create possible dictionary keys based on language combinations
    const possibleKeys = [
      `${sourceLang}_to_${targetLang}`,
      `${sourceLang}-${targetLang}`,
      `${targetLang}_to_${sourceLang}`,
      `${targetLang}-${sourceLang}`
    ];

    // Search through possible dictionary combinations
    for (const key of possibleKeys) {
      if (this.dictionaries[key]) {
        const dictionary = this.dictionaries[key];
        
        // Direct match (case-insensitive)
        for (const [dictKey, dictValue] of Object.entries(dictionary)) {
          if (dictKey.toLowerCase() === searchText) {
            return {
              translation: dictValue,
              originalText: text,
              message: "Local dictionary match found",
              matchType: "exact",
              fuzzyMatchScore: 1.0,
              matchedWord: dictKey,
              source: "local"
            };
          }
        }
      }
    }

    return null; // No match found
  }

  async translate(sourceLang, targetLang, text) {
    try {
      // First, try local lookup
      const localResult = this.localLookup(sourceLang, targetLang, text);
      if (localResult) {
        console.log("Translation found locally:", localResult);
        return localResult;
      }

      // If no local match found, proceed with API call
      console.log("No local match found, calling API...");
      
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
          source: "api"
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

  // Updated batch translation method to use local lookup first
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

  // Optional: Method to get available dictionary keys for debugging
  getAvailableDictionaries() {
    return Object.keys(this.dictionaries);
  }

  // Optional: Method to check if a language pair is available locally
  hasLocalSupport(sourceLang, targetLang) {
    const possibleKeys = [
      `${sourceLang}_to_${targetLang}`,
      `${sourceLang}-${targetLang}`,
      `${targetLang}_to_${sourceLang}`,
      `${targetLang}-${sourceLang}`
    ];

    return possibleKeys.some(key => this.dictionaries[key]);
  }
}