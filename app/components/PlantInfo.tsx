"use client";
import {
  FaLeaf,
  FaSun,
  FaTint,
  FaSeedling,
  FaGlobeAmericas,
  FaFlask,
  FaDisease,
} from 'react-icons/fa';
import { KeyValue } from '../components/ImageUpload';

interface PlantInfoProps {
  plantInfo: KeyValue | null;
  loading: boolean;
  imageSrc: string | null;
}

export default function PlantInfo({ plantInfo, loading, imageSrc }: PlantInfoProps) {
  if (loading) {
    return (
      <div className="mt-8 text-center text-green-700">
        <p className="text-lg">Analyzing your plant...</p>
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div className="mt-8 text-center text-green-700">
        <p className="text-lg">Please upload an image to view plant information.</p>
      </div>
    );
  }


  const isPlant = plantInfo?.commonName !== undefined;

  const infoCards = isPlant
    ? [
        { icon: FaLeaf, title: 'Common Name', value: plantInfo?.commonName || 'N/A' },
        { icon: FaFlask, title: 'Scientific Name', value: plantInfo?.scientificName || 'N/A' },
        { icon: FaSun, title: 'Sunlight', value: plantInfo?.sunlight || 'N/A' },
        { icon: FaTint, title: 'Water Needs', value: plantInfo?.water || 'N/A' },
        { icon: FaSeedling, title: 'Growth Rate', value: plantInfo?.growthRate || 'N/A' },
        { icon: FaGlobeAmericas, title: 'Origin', value: plantInfo?.origin || 'N/A' },
      ]
    : [
        { icon: FaDisease, title: 'Disease Name', value: plantInfo?.diseaseName || 'N/A' },
        { icon: FaLeaf, title: 'Affected Part', value: plantInfo?.affectedPart || 'N/A' },
        { icon: FaFlask, title: 'Symptoms', value: plantInfo?.symptoms || 'N/A' },
        { icon: FaTint, title: 'Causes', value: plantInfo?.causes || 'N/A' },
        { icon: FaSeedling, title: 'Treatment', value: plantInfo?.treatment || 'N/A' },
      ];

  const description = isPlant ? plantInfo?.description : plantInfo?.symptoms;
  const descriptionTitle = isPlant ? 'Description' : 'Symptoms';

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-green-100">
      {/* Uploaded Image Section */}
      {imageSrc && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">
            Uploaded Image
          </h2>
          <div className="rounded-xl overflow-hidden border border-green-100">
            <img src={imageSrc} alt="Uploaded Plant" className="w-full h-auto" style={{ maxHeight: '300px', objectFit: 'cover' }} />
          </div>
        </div>
      )}

      {/* Plant Information Section */}
      <div>
        {/* Header */}
        <h2 className="text-4xl font-bold text-green-900 mb-8 text-center">
          {isPlant ? '🌿 Plant Information' : '🦠 Disease Information'}
        </h2>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-0 border border-green-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4 p-4">
                <div className="bg-green-50 rounded-lg p-2">
                  <card.icon className="text-green-600 text-lg" />
                </div>
                <h3 className="font-semibold text-xl text-green-800 ml-4">
                  {card.title}
                </h3>
              </div>
              <p className="text-green-700 text-lg break-words whitespace-normal px-4 pb-4">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description Section */}
        <div className="mt-10 bg-white rounded-xl shadow-lg p-8 border border-green-100">
          <h3 className="font-semibold text-3xl text-green-900 mb-6 text-center">
            {descriptionTitle}
          </h3>
          <p className="text-green-700 text-xl leading-relaxed whitespace-normal break-words">
            {description || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
