import i18next from 'i18next';

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  feedsContainer: document.querySelector('.feeds'),
  postsContainer: document.querySelector('.posts'),
};

const updateInterfaceTexts = () => {
  const appTitle = document.querySelector('h1');
  if (appTitle) {
    appTitle.textContent = i18next.t('appTitle');
  }
  const appSubtitle = document.querySelector('p.lead');
  if (appSubtitle) {
    appSubtitle.textContent = i18next.t('appSubtitle');
  }
  if (elements.input) {
    elements.input.placeholder = i18next.t('form.placeholder');
  }
  const button = elements.form.querySelector('button[type="submit"]');
  if (button) {
    button.textContent = i18next.t('form.button');
  }
};

const updateView = (state) => {
  if (state.form.error) {
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

  elements.feedsContainer.innerHTML = '';
  const feedHeader = document.createElement('h2');
  feedHeader.textContent = 'Фиды';
  elements.feedsContainer.append(feedHeader);
  state.feeds.forEach((feed) => {
    const feedElement = document.createElement('div');
    feedElement.classList.add('feed');
    feedElement.innerHTML = `<h2>${feed.title}</h2><p>${feed.description}</p>`;
    elements.feedsContainer.appendChild(feedElement);
  });

  elements.postsContainer.innerHTML = '';
  const postHeader = document.createElement('h2');
  postHeader.textContent = 'Посты';
  elements.postsContainer.append(postHeader);
  const postsList = document.createElement('ul');
  state.posts.forEach((post) => {
    const postItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = post.link;
    link.textContent = post.title;
    link.target = '_blank';
    postItem.appendChild(link);
    postsList.appendChild(postItem);
  });
  elements.postsContainer.appendChild(postsList);
};

export { elements, updateView, updateInterfaceTexts };
