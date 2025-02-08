// @ts-check
import validate from './validation.js';
import { elements, updateView } from './view.js';
import createState from './state.js';

export default () => {
  const state = createState();

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = elements.input.value.trim();

    state.form.status = 'validating';
    validate(url, state.feeds)
      .then(() => {
        state.feeds.push(url);
        state.form.status = 'success';
        state.form.error = null;
      })
      .catch((err) => {
        state.form.status = 'error';
        state.form.error = err.message;
      })
      .finally(() => updateView(state));
  });
};
