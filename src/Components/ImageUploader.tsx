import { useRef, useState } from "react";
import "./ImageUploader.css";

type UploadedImage = {
  id: string;
  file: File;
  preview: string;
};

const MAX_IMAGES = 4;

type ImageUploaderProps = {
  // Called whenever the selection changes, with the files ordered main image first.
  onChange?: (files: File[]) => void;
};

function ImageUploader({ onChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [mainImageId, setMainImageId] = useState<string | null>(null);

  // Update the local state and tell the parent form which files are selected (main image first)
  const applySelection = (nextImages: UploadedImage[], nextMainId: string | null) => {
    setImages(nextImages);
    setMainImageId(nextMainId);

    const main = nextImages.find((image) => image.id === nextMainId);
    const ordered = main
      ? [main, ...nextImages.filter((image) => image.id !== nextMainId)]
      : nextImages;
    onChange?.(ordered.map((image) => image.file));
  };

  // Open the device's file picker
  const handleAddPhotos = () => {
    fileInputRef.current?.click();
  };

  // Handle selected images
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (!selectedFiles) return;

    // The picker allows multiple files, so only keep as many as there is room for
    const files = Array.from(selectedFiles).slice(0, MAX_IMAGES - images.length);
    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      file: file,
      preview: URL.createObjectURL(file),
    }));

    if (newImages.length > 0) {
      // Make the first image the main image if there isn't one already
      applySelection([...images, ...newImages], mainImageId ?? newImages[0].id);
    }

    event.target.value = "";
  };

  // Delete an image
  const handleDelete = (id: string) => {
    const imageToDelete = images.find((image) => image.id === id);
    if (imageToDelete) URL.revokeObjectURL(imageToDelete.preview);

    const updatedImages = images.filter((image) => image.id !== id);

    // Adjust main image if deleted
    const nextMainId =
      mainImageId === id ? (updatedImages[0]?.id ?? null) : mainImageId;

    applySelection(updatedImages, nextMainId);
  };

  // Set an image as the main image
  const handleSetMain = (id: string) => {
    applySelection(images, id);
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
          disabled={images.length >= MAX_IMAGES}
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