import React, { useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface MultiImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    className?: string;
    folder?: string;
    skipBucketCheck?: boolean;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
    images = [],
    onImagesChange,
    className = '',
    folder = 'menu-images',
    skipBucketCheck = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage, uploading, uploadProgress } = useImageUpload(folder, skipBucketCheck);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        try {
            const newImages: string[] = [];

            // Upload each file sequentially
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const imageUrl = await uploadImage(file);
                if (imageUrl) {
                    newImages.push(imageUrl);
                }
            }

            onImagesChange([...images, ...newImages]);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to upload image');
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onImagesChange(newImages);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img
                                src={img}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            <div
                onClick={triggerFileSelect}
                className={`w-full border-2 border-dashed border-sky-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-all duration-300 bg-gradient-to-br from-sky-50/30 to-blue-50/30 ${uploading ? 'pointer-events-none opacity-70' : ''}`}
            >
                {uploading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Uploading... {Math.round(uploadProgress)}%</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                            <Plus className="h-6 w-6 text-sky-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Add Images</p>
                        <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP</p>
                    </>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
            />
        </div>
    );
};

export default MultiImageUpload;
