import i18next from 'i18next';
import * as yup from 'yup';

yup.setLocale({
  mixed: {
    default: () => i18next.t('errors.default'),
    required: () => i18next.t('errors.required'),
    notOneOf: () => i18next.t('errors.duplicate'),
  },
  string: {
    url: () => i18next.t('errors.invalidUrl'),
  },
});

export default (url, feeds) => {
  const schema = yup.string()
    .trim()
    .required()
    .url()
    .nullable()
    .notOneOf(feeds);

  return schema.validate(url);
};
