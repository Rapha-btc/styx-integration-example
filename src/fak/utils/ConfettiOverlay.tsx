// ConfettiOverlay.tsx
import React, { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiOverlayProps {
  isActive: boolean;
}

const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({ isActive }) => {
  useEffect(() => {
    if (isActive) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999, // Ensure it's above everything else
      });
    }
  }, [isActive]);

  return null; // This component doesn't render anything visible
};

export default ConfettiOverlay;
