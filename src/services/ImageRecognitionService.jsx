export class ImageRecognitionService {
  constructor() {
    // In production, this should be in environment variables
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key';
    this.apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
  }

  /**
   * Converts an image File object to a Base64 encoded string.
   * @param {File|string} input - The image file object or data URL.
   * @returns {Promise<string>} A promise that resolves with the Base64 string.
   */
  convertImageToBase64(input) {
    return new Promise((resolve, reject) => {
      if (typeof input === 'string') {
        // If input is already a data URL, extract base64 part
        const base64String = input.split(',')[1];
        resolve(base64String);
        return;
      }

      if (!input || !input.type?.startsWith('image/')) {
        return reject(new Error('Invalid file type. Please provide an image.'));
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(input);
    });
  }

  /**
   * Calls the Gemini Pro Vision API to identify the main object in an image.
   * @param {string} imageBase64 - The Base64 encoded image data.
   * @param {string} imageMimeType - The MIME type of the image.
   * @param {string} language - The desired language for the object name.
   * @returns {Promise<string|null>} A promise that resolves with the identified object name.
   */
  async identifyObjectWithGemini(imageBase64, imageMimeType, language = 'English') {
    const prompt = `Identify the main object or scene in this image. Return only the most specific and common name for it in ${language}. If unsure, provide the most likely category. Do not add any explanation or preamble.`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: imageMimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    };

    try {
      console.log('Sending request to Gemini API...');
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', responseData);
        throw new Error(responseData.error?.message || 'API request failed');
      }

      console.log('API Response:', responseData);

      // Extract the text result
      const candidate = responseData.candidates?.[0];
      if (candidate?.content?.parts?.[0]?.text) {
        return candidate.content.parts[0].text.trim();
      } else if (candidate?.finishReason === 'SAFETY') {
        return 'Content blocked due to safety policies';
      } else {
        return 'No text recognized in image';
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return null;
    }
  }

  /**
   * Main method to recognize image content.
   * @param {File|string} input - The image file object or data URL.
   * @param {string} language - The desired language for the result.
   * @returns {Promise<string|null>} A promise resolving with the identified name.
   */
  async recognizeImage(input, language = 'English') {
    try {
      // Convert image to Base64
      const imageDataBase64 = await this.convertImageToBase64(input);
      
      // Determine MIME type
      let imageMimeType = 'image/png';
      if (typeof input === 'object' && input.type) {
        imageMimeType = input.type;
      } else if (typeof input === 'string') {
        // Extract MIME type from data URL
        const mimeMatch = input.match(/data:([^;]+);/);
        if (mimeMatch) {
          imageMimeType = mimeMatch[1];
        }
      }

      // Call the Gemini API
      const identifiedName = await this.identifyObjectWithGemini(
        imageDataBase64,
        imageMimeType,
        language
      );

      return identifiedName;
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    }
  }
}