// src/components/Header.tsx
import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { home, settings } from 'ionicons/icons'; // Icons importieren
import Logo from '../assets/menschärgeredichnicht.png'; // Importiere das Logo

interface HeaderProps {
  title: string;
  pageTitle: string;
  collapse?: boolean; // Optional: Unterstützt collapse-Einstellungen
}

const Header: React.FC<HeaderProps> = ({ pageTitle, title, collapse = false }) => {
  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          {/* Linker Button */}
          <IonButtons slot="start">
          <IonButton onClick={() => window.location.href = "/ludo"}>
  <IonIcon icon={home} />
</IonButton>
            <span style={{ color: 'white', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
            {pageTitle}
          </span>
          </IonButtons>

          {/* Logo im Titel */}
          <IonTitle className="header-logo-container" style={{ textAlign: 'center' }}>
            <img src={Logo} alt="Slot Heaven Logo" style={{ maxHeight: '40px' }} />
          </IonTitle>

          {/* Rechter Button */}
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={settings} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* Optional: Kollabierender Header */}
      {collapse && (
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
      )}
    </>
  );
};

export default Header;
