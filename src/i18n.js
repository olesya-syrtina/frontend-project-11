import i18next from 'i18next';
import ruTranslations from './local/ru.json';

i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: {
      translation: ruTranslations,
    }
  }
});

export default i18next;