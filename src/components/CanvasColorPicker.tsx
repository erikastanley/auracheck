import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { hexToRgb, rgbToHex, rgbToHsl, ColorData, generateUniqueId } from '@/lib/colorUtils';
import { cn } from '@/lib/utils';
import { APP_COPY } from '@/lib/constants'; // Correctly import APP_COPY
interface CanvasColorPickerProps {
  imageUrl: string | null;
  onColorPick: (color: ColorData) => void;
  pickedColors: ColorData[];
}
export function CanvasColorPicker({ imageUrl, onColorPick, pickedColors }: CanvasColorPickerProps) {
  const [image] = useImage(imageUrl || '');
  const stageRef = useRef<any>(null); // Konva Stage ref
  const imageRef = useRef<any>(null); // Konva Image ref
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  // Adjust stage size to fit container and maintain aspect ratio
  const adjustStageSize = useCallback(() => {
    if (containerRef.current && image) {
      const containerWidth = containerRef.current.offsetWidth;
      // Calculate height to maintain aspect ratio
      const aspectRatio = image.height / image.width;
      const containerHeight = containerWidth * aspectRatio;
      setStageSize({ width: containerWidth, height: containerHeight });
    }
  }, [image]);
  useEffect(() => {
    adjustStageSize();
    window.addEventListener('resize', adjustStageSize);
    return () => window.removeEventListener('resize', adjustStageSize);
  }, [image, adjustStageSize]);
  const handleImageClick = useCallback((event: any) => {
    if (!image || !stageRef.current || !imageRef.current) return;
    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
    const imageNode = imageRef.current;
    const imageX = imageNode.x();
    const imageY = imageNode.y();
    const imageWidth = imageNode.width();
    const imageHeight = imageNode.height();
    // Calculate click position relative to the original image dimensions
    const scaleX = image.width / imageWidth;
    const scaleY = image.height / imageHeight;
    const x = Math.floor((pointerPosition.x - imageX) * scaleX);
    const y = Math.floor((pointerPosition.y - imageY) * scaleY);
    if (x < 0 || x >= image.width || y < 0 || y >= image.height) {
      console.warn("Click outside image bounds.");
      return;
    }
    try {
      // Create a temporary canvas to get pixel data
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = image.width;
      tempCanvas.height = image.height;
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!tempCtx) {
        console.error("Could not get 2D context for temporary canvas.");
        return;
      }
      tempCtx.drawImage(image, 0, 0);
      const pixelData = tempCtx.getImageData(x, y, 1, 1).data;
      const rgb = { r: pixelData[0], g: pixelData[1], b: pixelData[2] };
      const hex = rgbToHex(rgb);
      const hsl = rgbToHsl(rgb);
      onColorPick({ id: generateUniqueId(), hex, rgb, hsl });
    } catch (error) {
      console.error("Error picking color:", error);
      // Handle CORS issues or other canvas errors gracefully
      alert("Could not pick color. Please ensure the image is from the same origin or try a different image.");
    }
  }, [image, onColorPick]);
  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-2xl mx-auto card-base p-2 overflow-hidden",
        "border-2 border-gray-300 dark:border-gray-700 rounded-lg",
        imageUrl ? "cursor-crosshair" : "cursor-not-allowed bg-gray-100 dark:bg-gray-900"
      )}
      style={{ minHeight: imageUrl ? '200px' : '100px' }}
    >
      {imageUrl ? (
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleImageClick}
          onTouchStart={handleImageClick}
          ref={stageRef}
          className="rounded-md"
        >
          <Layer>
            {image && (
              <KonvaImage
                image={image}
                width={stageSize.width}
                height={stageSize.height}
                ref={imageRef}
                alt="Uploaded image for color picking"
              />
            )}
            {/* Render picked color indicators - Placeholder for future enhancement */}
            {pickedColors.map((color) => {
              // Visual indicators for picked colors can be added here in a future phase.
              // For now, we rely on the ColorPaletteDisplay.
              return null;
            })}
          </Layer>
        </Stage>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 text-center p-4">
          <p className="text-body">{APP_COPY.NO_IMAGE_UPLOADED}</p>
        </div>
      )}
    </div>
  );
}
