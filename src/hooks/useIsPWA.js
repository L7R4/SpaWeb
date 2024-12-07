import { useEffect, useState } from "react";

function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsPWA(isStandalone);
  }, []);

  return isPWA;
}

export default useIsPWA;
