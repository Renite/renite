import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AppClient from './client/AppClient';
import PoliceHome from './client/views/PoliceHome';
import './index.css';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      EN: {
        translation: {
          search: "Search...",
          notifications: "Notifications",
          markRead: "Mark all read",
          emptyNotif: "No new notifications"
        }
      },
      AM: {
        translation: {
          search: "ፈልግ...",
          notifications: "ማሳወቂያዎች",
          markRead: "ሁሉንም አንብብ",
          emptyNotif: "ምንም ማሳወቂያ የለም"
        }
      },
      OM: {
        translation: {
          search: "Barbaadi...",
          notifications: "Beeksisa",
          markRead: "Hunda dubbifame",
          emptyNotif: "Beeksisa haaraa hin jiru"
        }
      },
      TI: {
        translation: {
          search: "ድለይ...",
          notifications: "መፍለጢታት",
          markRead: "ኩሎም አንብብ",
          emptyNotif: "ሓዱሽ መፍለጢ የለን"
        }
      },
      AR: {
        translation: {
          search: "بحث...",
          notifications: "إشعارات",
          markRead: "تحديد الكل كمقروء",
          emptyNotif: "لا توجد إشعارات"
        }
      },
      SN: {
        translation: {
          search: "Search (SNNPR)...",
          notifications: "Notifications",
          markRead: "Mark all read",
          emptyNotif: "No notifications"
        }
      }
    },
    lng: 'EN',
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false
    }
  });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 👮‍♂️ ISOLATED POLICE PORTAL */}
        <Route path="/police-home/*" element={<PoliceHome />} />

        {/* 👨‍👩‍👧‍👦 CITIZEN PORTAL (Handles /, /login, /home, /assets, etc.) */}
        <Route path="/*" element={<AppClient />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);