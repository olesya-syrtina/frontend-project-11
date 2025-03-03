// @ts-check
import i18next from 'i18next';
import axios from 'axios';
import onChange from 'on-change';
import validate from './validation.js';
import {
  updateInterfaceTexts, updateFormView, updateFeedsView, updatePostsView,
} from './view.js';
import parseRSS from './parser.js';
import generateId from './utils.js';

const getProxyUrl = (url) => {
  const baseUrl = 'https://allorigins.hexlet.app/get';
  const proxyUrl = new URL(baseUrl);
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
  };

  const state = {
    feeds: [],
    posts: [],
    form: {
      status: 'filling',
      error: null,
    },
    ui: {
      viewedPostsIds: new Set(),
    },
  };

  const watchedState = onChange(state, (path) => {
    if (path.startsWith('form')) {
      updateFormView(watchedState, elements);
    }
    if (path === 'feeds') {
      updateFeedsView(watchedState, elements);
    }
    if (path === 'posts') {
      updatePostsView(watchedState, elements);
    }
    if (path === 'ui.viewedPostsIds') {
      updatePostsView(watchedState, elements);
    }
  });

  updateInterfaceTexts(elements);

  let updateFeedsIntervalId = null;

  const fetchRss = (url) => axios.get(url)
    .then((response) => response.data)
    .catch(() => {
      throw new Error(i18next.t('feedback.default'));
    });

  const updateFeeds = () => {
    if (watchedState.feeds.length === 0) {
      return;
    }

    const promises = watchedState.feeds.map((feed) => {
      const proxyUrl = getProxyUrl(feed.url);
      return fetchRss(proxyUrl)
        .then((data) => {
          const rssContent = data.contents;
          const parsed = parseRSS(rssContent);
          const currentPostLinks = watchedState.posts
            .filter((post) => post.feedId === feed.id)
            .map((post) => post.link);
          const newPosts = parsed.items.filter((post) => !currentPostLinks.includes(post.link));
          return newPosts.map((post) => ({
            id: generateId(),
            feedId: feed.id,
            title: post.title,
            link: post.link,
            description: post.description,
          }));
        })
        .catch((err) => {
          console.error(`Ошибка обновления для ${feed.url}:`, err);
          return [];
        });
    });

    Promise.all(promises)
      .then((results) => {
        const newPosts = results.flat();
        if (newPosts.length > 0) {
          watchedState.posts = [...newPosts, ...watchedState.posts];
        }
      })
      .finally(() => {
        if (watchedState.feeds.length === 1 && !updateFeedsIntervalId) {
          updateFeedsIntervalId = setInterval(updateFeeds, 5000);
        }
      });
  };

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = elements.input.value.trim();

    watchedState.form.status = 'validating';

    validate(url, watchedState.feeds.map((feed) => feed.url))
      .then(() => {
        watchedState.form.status = 'loading';
        return fetchRss(getProxyUrl(url));
      })
      .then((data) => {
        const rssContent = data.contents;
        const parsed = parseRSS(rssContent);
        const feedId = generateId();
        const feed = {
          id: feedId,
          title: parsed.element.title,
          description: parsed.element.description,
          url,
        };
        watchedState.feeds.push(feed);
        const postsWithId = parsed.items.map((post) => ({
          id: generateId(),
          feedId,
          title: post.title,
          link: post.link,
          description: post.description,
        }));
        watchedState.posts = [...watchedState.posts, ...postsWithId];
        watchedState.form.status = 'success';
        watchedState.form.error = null;

        updateFeeds();
      })
      .catch((err) => {
        watchedState.form.status = 'error';
        watchedState.form.error = err.message;
      });
  });
};
