import i18next from 'i18next';
// eslint-disable-next-line import/extensions
import ruTranslations from './local/ru.json';

i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: {
      translation: ruTranslations,
    },
  },
});

export default i18next;
