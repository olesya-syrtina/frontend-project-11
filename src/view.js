import i18next from 'i18next';

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback')
};

const updateInterfaceTexts = () => {
  const titleElement = document.querySelector('h1.display-3');
  if (titleElement) {
    titleElement.textContent = i18next.t('appTitle');
  }
  const subtitleElement = document.querySelector('p.lead');
  if (subtitleElement) {
    subtitleElement.textContent = i18next.t('appSubtitle');
  }
  const labelElement = document.querySelector('label[for="url-input"]');
  if (labelElement) {
    labelElement.textContent = i18next.t('form.placeholder');
  }
  if (elements.input) {
    elements.input.placeholder = i18next.t('form.placeholder');
  }
  const buttonElement = document.querySelector('.rss-form button[type="submit"]');
  if (buttonElement) {
    buttonElement.textContent = i18next.t('form.button');
  }
};

const updateView = (state) => {
  if (state.form.status === 'error') {
    elements.input.classList.add('is-invalid');
    elements.feedback.textContent = i18next.t(state.form.error);
  } else {
    elements.input.classList.remove('is-invalid');
    elements.feedback.textContent = '';
  }

  if (state.form.status === 'success') {
    elements.form.reset();
    elements.input.focus();
  }
};

export { elements, updateView, updateInterfaceTexts };