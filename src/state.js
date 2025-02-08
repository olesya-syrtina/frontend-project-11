import onChange from 'on-change';

const getDefaultState = () => ({
  feeds: [],
  form: {
    status: 'filling',
    error: null,
  },
});

const createState = () => {
  const state = getDefaultState();
  return onChange(state, () => {});
};

export default createState;
