import React, { useState, useRef } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageCropDialogProps {
  imageUrl: string;
  onCrop: (croppedImage: Blob) => void;
  onClose: () => void;
}

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
  imageUrl,
  onCrop,
  onClose,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: (100 * 420) / 1600, // Maintain 1600:840 aspect ratio
    x: 0,
    y: 0,
  });
  const aspect = 1600 / 420;
  const imageRef = useRef<HTMLImageElement>(null);

  const handleCrop = () => {
    if (imageRef.current && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imageRef.current,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              onCrop(blob);
            }
          },
          "image/jpeg",
          1
        );
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={aspect}>
          <Image ref={imageRef} src={imageUrl} alt="Crop me" layout="responsive" />
        </ReactCrop>
        <DialogFooter>
          <Button onClick={handleCrop}>Crop and Upload</Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;
