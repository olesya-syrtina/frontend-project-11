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

const updateFormView = (state, elements) => {
  const { input, feedback, form } = elements;

  if (state.form.error) {
    feedback.textContent = state.form.error;
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger', 'show');
  } else {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
  }

  if (state.form.status === 'success') {
    feedback.textContent = i18next.t('feedback.success');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success', 'show');
    form.reset();
    input.focus();
  }
};

const updateFeedsView = (state, elements) => {
  const { feedsContainer } = elements;
  feedsContainer.innerHTML = '';
  if (state.feeds.length > 0) {
    const feedsTitle = i18next.t('feeds.title');
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
};

const updatePostsView = (state, elements) => {
  const { postsContainer } = elements;
  postsContainer.innerHTML = '';
  if (state.posts.length > 0) {
    const postsTitle = i18next.t('posts.title');
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
      previewButton.textContent = i18next.t('posts.previewButton');
      previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      postItem.appendChild(previewButton);

      previewButton.addEventListener('click', (event) => {
        event.preventDefault();
        state.ui.viewedPostsIds.add(post.id);
        // eslint-disable-next-line no-param-reassign
        state.ui.modalPostId = post.id;
      });

      postsList.appendChild(postItem);
    });
    postsContainer.appendChild(postsList);
  }
};

export {
  updateInterfaceTexts,
  showModal,
  updateFormView,
  updateFeedsView,
  updatePostsView,
};
