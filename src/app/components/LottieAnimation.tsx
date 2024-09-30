import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieAnimationProps {
  animationData: object; // Loại của dữ liệu animation
  loop?: boolean;
  autoplay?: boolean;
  width?: string | number; // Thêm width
  height?: string | number; // Thêm height
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationData, loop = false, autoplay = true, width = '100%', height = '100%' }) => {
  const animationContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        animationData,
        loop,
        autoplay,
      });

      return () => {
        anim.destroy(); // Hủy animation khi component bị unmount
      };
    }
  }, [animationData, loop, autoplay]);

  return <div ref={animationContainer} style={{ width, height }} />;
};

export default LottieAnimation;
