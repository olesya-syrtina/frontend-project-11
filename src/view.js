import i18next from 'i18next';
import * as bootstrap from 'bootstrap';

const updateInterfaceTexts = (elements) => {
  const { input, form } = elements;
  const appTitle = document.querySelector('h1');
  if (appTitle) {
    appTitle.textContent = i18next.t('appTitle');
  }
  const appSubtitle = document.querySelector('p.lead');
  if (appSubtitle) {
    appSubtitle.textContent = i18next.t('appSubtitle');
  }
  if (input) {
    input.placeholder = i18next.t('form.placeholder');
  }
  const button = form.querySelector('button[type="submit"]');
  if (button) {
    button.textContent = i18next.t('form.button');
  }
};

const showModal = (title, description, link, elements) => {
  const { modal } = elements;
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const fullArticleLink = modal.querySelector('.full-article');

  modalTitle.textContent = title;
  modalBody.textContent = description;
  fullArticleLink.href = link;

  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
};

const updateView = (state, elements) => {
  const {
    input, feedback, form, feedsContainer, postsContainer,
  } = elements;

  if (state.form.error) {
    input.classList.add('is-invalid');
    feedback.textContent = state.form.error;
  } else {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
  }

  if (state.form.status === 'success') {
    form.reset();
    input.focus();
  }

  feedsContainer.innerHTML = '';
  if (state.feeds.length > 0) {
    const feedsTitle = i18next.exists('feeds.title') ? i18next.t('feeds.title') : 'Фиды';
    const feedHeader = document.createElement('h2');
    feedHeader.textContent = feedsTitle;
    feedsContainer.append(feedHeader);
    state.feeds.forEach((feed) => {
      const feedElement = document.createElement('div');
      feedElement.classList.add('feed');
      feedElement.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`;
      feedsContainer.appendChild(feedElement);
    });
  }

  postsContainer.innerHTML = '';
  if (state.posts.length > 0) {
    const postsTitle = i18next.exists('posts.title') ? i18next.t('posts.title') : 'Посты';
    const postHeader = document.createElement('h2');
    postHeader.textContent = postsTitle;
    postsContainer.append(postHeader);
    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'border-0', 'rounded-0');

    state.posts.forEach((post) => {
      const postItem = document.createElement('li');
      postItem.classList.add(
        'list-group-item',
        'border-0',
        'd-flex',
        'justify-content-between',
        'align-items-start',
      );

      const link = document.createElement('a');
      link.href = post.link;
      link.textContent = post.title;
      link.target = '_blank';
      if (state.ui.viewedPostsIds.has(post.id)) {
        link.classList.add('fw-normal');
      } else {
        link.classList.add('fw-bold');
      }
      postItem.appendChild(link);

      const previewButton = document.createElement('button');
      previewButton.textContent = 'Просмотр';
      previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      postItem.appendChild(previewButton);

      previewButton.addEventListener('click', (event) => {
        event.preventDefault();
        state.ui.viewedPostsIds.add(post.id);
        link.classList.remove('fw-bold');
        link.classList.add('fw-normal');
        showModal(post.title, post.description, post.link, elements);
      });

      postsList.appendChild(postItem);
    });
    postsContainer.appendChild(postsList);
  }
};

export { updateInterfaceTexts, updateView };
