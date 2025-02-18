import * as yup from 'yup';

yup.setLocale({
  mixed: {
    default: () => 'errors.default',
    required: () => 'errors.required'
  },
  string: {
    url: () => 'errors.invalidUrl',
    notOneOf: () => 'errors.duplicate'
  }
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