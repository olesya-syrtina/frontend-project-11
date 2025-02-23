import i18next from 'i18next';
import * as bootstrap from 'bootstrap';

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  feedsContainer: document.querySelector('.feeds'),
  postsContainer: document.querySelector('.posts'),
  modal: document.querySelector('#modal')
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

const showModal = (title, description, link) => {
  const modalTitle = elements.modal.querySelector('.modal-title');
  const modalBody = elements.modal.querySelector('.modal-body');
  const fullArticleLink = elements.modal.querySelector('.full-article');

  modalTitle.textContent = title;
  modalBody.textContent = description;
  fullArticleLink.href = link;

  const modalInstance = new bootstrap.Modal(elements.modal);
  modalInstance.show();
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
  if (state.feeds.length > 0) {
    const feedHeader = document.createElement('h2');
    feedHeader.textContent = 'Фиды';
    elements.feedsContainer.append(feedHeader);
    state.feeds.forEach((feed) => {
      const feedElement = document.createElement('div');
      feedElement.classList.add('feed');
      feedElement.innerHTML = `<h2>${feed.title}</h2><p>${feed.description}</p>`;
      elements.feedsContainer.appendChild(feedElement);
    });
  };

  elements.postsContainer.innerHTML = '';
  if (state.posts.length > 0) {
    const postHeader = document.createElement('h2');
    postHeader.textContent = 'Посты';
    elements.postsContainer.append(postHeader);
    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'border-0', 'rounded-0');

    state.posts.forEach((post) => {
      const postItem = document.createElement('li');
      postItem.classList.add('list-group-item', 'border-0', 'border-end-0', 'd-flex', 'justify-content-between', 'align-items-start');
      const link = document.createElement('a');
      link.href = post.link;
      link.textContent = post.title;
      link.target = '_blank';
      link.classList.add(post.isRead ? 'fw-normal' : 'fw-bold');
      postItem.appendChild(link);

      const postButton = document.createElement('button');
      postButton.textContent = 'Загрузить';
      postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      postItem.append(postButton);

      postButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (!post.isRead) {
          post.isRead = true;
          link.classList.remove('fw-bold');
          link.classList.add('fw-normal');
        }
        showModal(post.title, post.description, post.link);
      });
      postsList.appendChild(postItem);
    });

    elements.postsContainer.appendChild(postsList);
  };
};

export { elements, updateView, updateInterfaceTexts };
