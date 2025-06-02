import { FaUpload, FaLeaf, FaInfoCircle } from 'react-icons/fa';

interface HowToUseProps {
  purpose: string;
}

export default function HowToUse({ purpose }: HowToUseProps) {
  const title = purpose === "plant" ? "Plant Identification" : "Plant Disease Identification";
  const uploadText = purpose === "plant" ? "plant" : "plant disease";

  return (
    <div className="mt-16 bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg border border-green-200">
      <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
        How to Use <span className="text-green-600">{title}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Upload an Image */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-100">
          <div className="flex items-start">
            <div className="p-3 bg-green-50 rounded-full">
              <FaUpload className="text-green-600 text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-xl text-green-800 mb-2">Upload an Image</h3>
              <p className="text-green-700">
                Take a clear photo of the {uploadText} you want to identify and upload it.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Get Identification */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-100">
          <div className="flex items-start">
            <div className="p-3 bg-green-50 rounded-full">
              <FaLeaf className="text-green-600 text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-xl text-green-800 mb-2">Get Identification</h3>
              <p className="text-green-700">
                Our AI will analyze the image and provide the {purpose}'s name and details.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Learn More */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-100">
          <div className="flex items-start">
            <div className="p-3 bg-green-50 rounded-full">
              <FaInfoCircle className="text-green-600 text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-xl text-green-800 mb-2">Learn More</h3>
              <p className="text-green-700">
                Discover care tips, origin, and interesting facts about the identified {purpose}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}