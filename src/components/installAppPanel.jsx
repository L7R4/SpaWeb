import React, { useState, useEffect } from "react";
import buttonDownload from 'icons/buttonDownload.svg';

function InstallButtonPanel() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Evita que se muestre el prompt del navegador
      setDeferredPrompt(e);
      setIsInstallable(true); // Activa el botón de instalación
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Muestra el prompt personalizado
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("El usuario aceptó la instalación");
          setIsInstallable(false);
        } else {
          console.log("El usuario rechazó la instalación");
        }
        setDeferredPrompt(null); // Resetea el evento
      });
    }
  };

  return (
    <>
      {isInstallable && (
        <div className="panelInstallAppWrapper">
            <h3>¿Quieres obtener descuentos y beneficios?</h3><br />
            <h3 className="textAction">¡Instala nuestra app!</h3>

            <button onClick={handleInstallClick} className="install-button">
              <img src={buttonDownload} alt="buttonDownload" className="buttonDownloadImage" />
            </button>
        </div>
      )}
    </>
  );
}

export default InstallButtonPanel;
