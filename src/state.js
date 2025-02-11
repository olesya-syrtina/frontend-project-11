import onChange from 'on-change';

const getDefaultState = () => ({
  feeds: [],
  form: {
    status: 'filling',
    error: null,
  },
});

export default () => {
  const state = getDefaultState();
  return onChange(state, () => {
  });
};