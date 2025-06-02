"use client";
import PlantInfo from './components/PlantInfo';
import { useState, Dispatch, SetStateAction } from 'react';
import HowToUse from './components/HowToUse';
import ImageUpload, { KeyValue } from './components/ImageUpload';

export default function Home() {
  const [plantInfo, setPlantInfo] = useState<KeyValue | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'plant' | 'disease'>('plant'); // Toggle between plant and disease modes
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    try {
      // Simulate API call
      const formData = new FormData();
      formData.append('file', file);
      
      const endpoint = mode === 'plant' ? '/api/identify-plant' : '/api/identify-disease';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Identification failed. Please try again.');
      }

      const data = await response.json();
      setPlantInfo(data);
    } catch (err) {
      console.error(err);
      setPlantInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Background leaf pattern */}
      <div className="absolute inset-0 bg-[url('/leaf-pattern.svg')] bg-repeat opacity-10 -z-10" />

      <div className="w-full mx-auto py-24 pl-4 sm:pl-6 lg:pl-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-900 font-serif mb-4">
            Discover the Green World
          </h1>
          <p className="text-xl text-green-700 max-w-2xl mx-auto">
            Identify plants and diseases, learn about their species, and explore the beauty of nature with our AI-powered identification tool.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => {
              setMode('plant');
              setPlantInfo(null); // Reset plantInfo when switching to plant mode
              setImagePreview(null); // Reset image preview
            }}
            className={`px-6 py-2 rounded-l-lg ${mode === 'plant' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'} transition-colors duration-200`}
          >
            Plant Identification
          </button>
          <button
            onClick={() => {
              setMode('disease');
              setPlantInfo(null); // Reset plantInfo when switching to disease mode
              setImagePreview(null); // Reset image preview
            }}
            className={`px-6 py-2 rounded-r-lg ${mode === 'disease' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'} transition-colors duration-200`}
          >
            Disease Identification
          </button>
        </div>

        {/* HowToUse Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-12 border border-green-100">
          <HowToUse purpose={mode} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Upload Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">
              Upload Your Image
            </h2>
            <ImageUpload
              setPlantInfo={setPlantInfo}
              setLoading={setLoading}
              identificationType={mode}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />
            {loading && (
              <p className="mt-4 text-green-700">Identifying your {mode}...</p>
            )}
          </div>

          {/* Plant/Disease Info Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">
              {mode === 'plant' ? 'Plant Details' : 'Disease Details'}
            </h2>
            <PlantInfo plantInfo={plantInfo} loading={loading} imageSrc={imagePreview} />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="hidden lg:block">
          <div className="absolute top-0 left-0 w-48 h-48 bg-green-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-300 rounded-full opacity-20 blur-3xl" />
        </div>
      </div>
    </main>
  );
}
