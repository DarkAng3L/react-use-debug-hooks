import { useRef, useEffect } from 'react';

const useRenderCount = (): number => {
  const count = useRef(1);

  useEffect(() => {
    // Updated in useEffect() to not count twice if using React.StrictMode
    count.current += 1;
  });

  return count.current;
};

export default useRenderCount;
