import React from "react";
import { Box, Image } from "@chakra-ui/react";

interface MediaDisplayProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onError?: (error?: any) => void; // Updated this line
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  src,
  alt,
  fallbackSrc = "/icons/default-token.svg",
  width = "40px",
  height = "40px",
  className,
  onError,
}) => {
  const [error, setError] = React.useState(false);

  const handleError = () => {
    console.log("Image load error for:", src);
    console.log("Current error state:", error);
    if (!error) {
      console.log("Setting error state and falling back to:", fallbackSrc);
      setError(true);
      onError?.();
    }
  };

  const finalSrc = error ? fallbackSrc : src;

  return (
    <Box
      position="relative"
      width={width}
      height={height}
      className={className}
    >
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        onError={handleError}
        width="100%"
        height="100%"
        objectFit="contain"
        borderRadius="full"
      />
    </Box>
  );
};

export default MediaDisplay;
