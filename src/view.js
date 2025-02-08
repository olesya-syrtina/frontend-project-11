const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
};

const updateView = (state) => {
  if (state.form.status === 'error') {
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = state.form.error;
  } else {
    elements.input.classList.remove('is-invalid');
    elements.feedback.textContent = '';
  }

  if (state.form.status === 'success') {
    elements.form.reset();
    elements.input.focus();
  }
};

export { elements, updateView };
