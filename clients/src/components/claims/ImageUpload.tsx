import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ImageUploadProps {
    onImagesChange: (files: File[]) => void;
    maxFiles?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    onImagesChange,
    maxFiles = 10,
}) => {
    const [images, setImages] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );

        addImages(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            addImages(files);
        }
    };

    const addImages = (newFiles: File[]) => {
        const remainingSlots = maxFiles - images.length;
        const filesToAdd = newFiles.slice(0, remainingSlots);
        const updatedImages = [...images, ...filesToAdd];
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    const handleCameraCapture = () => {
        // Trigger file input with capture attribute for mobile
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e: any) => {
            if (e.target.files) {
                addImages(Array.from(e.target.files));
            }
        };
        input.click();
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                    }
        `}
            >
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Damage Photos
                </h3>
                <p className="text-gray-600 mb-4">
                    Drag and drop images here, or click to select files
                </p>
                <div className="flex justify-center gap-3">
                    <label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileInput}
                            className="hidden"
                        />
                        <Button as="span" variant="primary">
                            Choose Files
                        </Button>
                    </label>
                    <Button variant="secondary" onClick={handleCameraCapture}>
                        📷 Take Photo
                    </Button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                    Maximum {maxFiles} images • JPEG, PNG, WebP
                </p>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 w-8 h-8 bg-danger-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-danger-600"
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                {(image.size / 1024).toFixed(0)} KB
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
