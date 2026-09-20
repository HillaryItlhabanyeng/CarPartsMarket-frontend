import { useRef, useState } from "react";
import "./ImageUploader.css";

type UploadedImage = {
  id: string;
  file: File;
  preview: string;
};

function ImageUploader() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [mainImageId, setMainImageId] = useState<string | null>(null);

  // Open the device's file picker
  const handleAddPhotos = () => {
    fileInputRef.current?.click();
  };

  // Handle selected images
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (!selectedFiles) return;

    const files = Array.from(selectedFiles);
    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setImages((previousImages) => {
      const updatedImages = [...previousImages, ...newImages];

      // Make the first image the main image if there isn't one already
      if (!mainImageId && newImages.length > 0) {
        setMainImageId(newImages[0].id);
      }

      return updatedImages;
    });

    event.target.value = "";
  };

  // Delete an image
  const handleDelete = (id: string) => {
    const imageToDelete = images.find((image) => image.id === id);
    if (imageToDelete) URL.revokeObjectURL(imageToDelete.preview);

    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);

    // Adjust main image if deleted
    if (mainImageId === id) {
      if (updatedImages.length > 0) {
        setMainImageId(updatedImages[0].id);
      } else {
        setMainImageId(null);
      }
    }
  };

  // Set an image as the main image
  const handleSetMain = (id: string) => {
    setMainImageId(id);
  };

  // Get the current main image object
  const mainImage = images.find((img) => img.id === mainImageId) || null;

  return (
    <div className="image-uploader-dark">
      <h2 className="upload-title">Upload Images</h2>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      {/* Main Large Preview */}
      <div className="main-preview">
        {mainImage ? (
          <img src={mainImage.preview} alt="Main preview" />
        ) : (
          <div className="empty-main-preview">No image selected</div>
        )}
      </div>

      {/* Thumbnails Row */}
      <div className="thumbnail-row">
        {images.map((image) => (
          <div
            className={`thumbnail-card ${
              mainImageId === image.id ? "active-thumbnail" : ""
            }`}
            key={image.id}
            onClick={() => handleSetMain(image.id)}
          >
            <img src={image.preview} alt="Product preview" />
            
            {/* Delete Badge */}
            <button
              type="button"
              className="delete-badge"
              onClick={(e) => {
                e.stopPropagation(); // Prevent setting as main when deleting
                handleDelete(image.id);
              }}
              aria-label="Delete image"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add button (always visible, disabled if 4 images) */}
        <button
          type="button"
          className="add-image-button"
          onClick={handleAddPhotos}
          disabled={images.length >= 4}
        >
          +
        </button>
      </div>

      {/* Helper Text */}
      {/* {images.length >= 4 && ( */}
        <p className="upload-limit-info">You can upload up to 4 photos.</p>
      {/* )} */}
    </div>
  );
}

export default ImageUploader;