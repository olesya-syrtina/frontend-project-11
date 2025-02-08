import * as yup from 'yup';

const validate = (url, feeds) => {
  const urlSchema = yup
    .string()
    .trim()
    .required()
    .url()
    .nullable()
    .notOneOf(feeds);

  return urlSchema.validate(url);
};

export default validate;
