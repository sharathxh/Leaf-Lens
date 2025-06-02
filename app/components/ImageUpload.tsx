'use client'

import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

// Define the type for the object with fixed keys
export interface KeyValue {
  key: string;
  commonName: string;
  scientificName: string;
  sunlight: string;
  water: string;
  growthRate: string;
  origin: string;
  description: string;
  diseaseName?: string;
  affectedPart?: string;
  symptoms?: string;
  causes?: string;
  treatment?: string;
}

interface ImageUploadProps {
  setPlantInfo: Dispatch<SetStateAction<KeyValue | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  identificationType: string;
}

// Ensure the API Key is available
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('API Key is missing. Please check your .env file.');
}

const genAI = new GoogleGenerativeAI(apiKey);

function extractJSON(str: string): KeyValue | null {
  // First, try to parse the entire string as JSON
  try {
    return JSON.parse(str);
  } catch (e) {
    // Failed to parse entire string as JSON
  }

  // If that fails, try to find a JSON object within the string
  try {
    const match = str.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
  } catch (e) {
    // Failed to extract and parse JSON object
  }

  // If all else fails, attempt to create a JSON object from key-value pairs
  try {
    const lines = str.split('\n');
    const obj: KeyValue = {
      key: '',
      commonName: '',
      scientificName: '',
      sunlight: '',
      water: '',
      growthRate: '',
      origin: '',
      description: '',
    };
    lines.forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value) {
        (obj as any)[key] = value;
      }
    });
    return obj;
  } catch (e) {
    // Failed to create JSON object from key-value pairs
  }

  console.error("Could not extract any valid JSON or key-value pairs from the response");
  return null;
}

interface ImageUploadProps {
  setPlantInfo: Dispatch<SetStateAction<KeyValue | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  identificationType: string;
  imagePreview: string | null;
  setImagePreview: Dispatch<SetStateAction<string | null>>;
}

export default function ImageUpload({ setPlantInfo, setLoading, identificationType, imagePreview, setImagePreview }: ImageUploadProps) {
  const [_loading, _setLoading] = useState(false);

  const handleImageInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    _setLoading(true);

    try {
      // Set image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const base64Image = await readFileAsDataURL(file);
      await processImage(base64Image, identificationType);
    } catch (error) {
      console.error('Error identifying plant:', error);
      handleProcessingError();
    } finally {
      _setLoading(false);
    }
  }

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const processImage = async (base64Image: string, identificationType: string) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let prompt = "";

    if (identificationType === "plant") {
      prompt = "Identify this plant and provide the following information: common name, scientific name, brief description, origin, sunlight requirements, water needs, soil type, and growth rate. Format the response as JSON with keys: commonName, scientificName, description, origin, sunlight, water, soil, growthRate.";
    } else if (identificationType === "disease") {
      prompt = "Identify the plant disease in this image and provide the following information: disease name, affected plant part, symptoms, causes, and treatment. Format the response as JSON with keys: diseaseName, affectedPart, symptoms, causes, treatment.";
    }
  
    try {
      const result = await model.generateContent([
        prompt, 
        { inlineData: { data: base64Image.split(',')[1], mimeType: "image/jpeg" } }
      ]);
      const response = await result.response;
      const text = await response.text();
  
      const parsedInfo = extractJSON(text);
      if (parsedInfo) {
        setPlantInfo(parsedInfo);
      } else {
        console.error("Failed to parse information. Raw text:", text);
        throw new Error("Failed to parse information");
      }
    } catch (error) {
      console.error("Error in processImage:", error);
      handleProcessingError();
    }
  };
  
  const handleProcessingError = () => {
    setPlantInfo({
      key: '',
      commonName: "Unknown",
      scientificName: "N/A",
      description: "Unable to extract information. Please try again.",
      origin: "N/A",
      sunlight: "N/A",
      water: "N/A",
      growthRate: "N/A",
      diseaseName: "Unknown",
      affectedPart: "N/A",
      symptoms: "N/A",
      causes: "N/A",
      treatment: "N/A"
    });
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Upload Button */}
      <label
        htmlFor="upload-input"
        className="flex items-center justify-center w-full p-4 bg-white text-[#008a05] rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
      >
        <FontAwesomeIcon icon={faUpload} className="mr-2" />
        {_loading ? 'Processing image...' : 'Upload Image'}
      </label>
      <input
        id="upload-input"
        type="file"
        accept="image/*"
        onChange={handleImageInput}
        className="hidden"
      />

      {/* Image Preview and Processing Message */}
      {_loading && imagePreview && (
        <div className="mt-4 text-center">
          <p className="text-green-700 mb-2">Processing your image...</p>
          <img
            src={imagePreview}
            alt="Uploaded Plant"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Image Preview After Processing */}
      {!_loading && imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Uploaded Plant"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}
