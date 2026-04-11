import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  url: string;
  className?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ url, className }) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error('Error loading Lottie animation:', error));
  }, [url]);

  if (!animationData) {
    return <div className={`animate-pulse bg-white/5 rounded-full ${className}`}></div>;
  }

  return (
    <div className={className}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default LottieAnimation;
