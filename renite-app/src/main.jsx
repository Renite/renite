import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. Import BrowserRouter
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AppClient from './client/AppClient';
import './index.css';

// (Optional) Your i18n initialization can stay here or in i18n.js
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
    <BrowserRouter> {/* <-- 2. Wrap AppClient with BrowserRouter */}
      <AppClient />
    </BrowserRouter>
  </React.StrictMode>
);