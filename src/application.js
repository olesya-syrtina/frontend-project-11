// @ts-check
import i18next from 'i18next';
import validate from './validation.js';
import { elements, updateView, updateInterfaceTexts } from './view.js';
import createState from './state.js';
import parseRSS from './parser.js';
import { generateId } from './utils.js';

const getProxyUrl = (url) => {
  const baseUrl = 'https://allorigins.hexlet.app/get';
  const proxyUrl = new URL(baseUrl);
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

const updateFeeds = (state) => {
  if (state.feeds.length === 0) {
    setTimeout(() => updateFeeds(state), 500000);
    return;
  }

  const promises = state.feeds.map((feed) => {
    const proxyUrl = getProxyUrl(feed.url);
    return fetch(proxyUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(i18next.t('feedback.default'));
        }
        return response.json();
      })
      .then((data) => {
        const rssContent = data.contents;
        const parsed = parseRSS(rssContent);
        const currentPostLinks = state.posts
          .filter((post) => post.feedId === feed.id)
          .map((post) => post.link);
        const newPosts = parsed.posts.filter((post) => !currentPostLinks.includes(post.link));
        const postsWithId = newPosts.map((post) => ({
          id: generateId(),
          feedId: feed.id,
          title: post.title,
          link: post.link,
          description: post.description,
          isRead: false,
        }));
        return postsWithId;
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
        state.posts = [...newPosts, ...state.posts];
      }
    })
    .finally(() => {
      updateView(state);
      setTimeout(() => updateFeeds(state), 5000);
    });
};

export default () => {
  const state = createState();

  updateInterfaceTexts();

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = elements.input.value.trim();

    state.form.status = 'validating';
    validate(url, state.feeds.map((feed) => feed.url))
      .then(() => {
        state.form.status = 'loading';
        return fetch(getProxyUrl(url));
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(i18next.t('feedback.default'));
        }
        return response.json();
      })
      .then((data) => {
        const rssContent = data.contents;
        const parsed = parseRSS(rssContent);
        const feedId = generateId();
        const feed = {
          id: feedId,
          title: parsed.feed.title,
          description: parsed.feed.description,
          url,
        };
        state.feeds.push(feed);
        const postsWithId = parsed.posts.map((post) => ({
          id: generateId(),
          feedId,
          title: post.title,
          link: post.link,
          description: post.description,
          isRead: false,
        }));
        state.posts = [...state.posts, ...postsWithId];
        state.form.status = 'success';
        state.form.error = null;
      })
      .catch((err) => {
        state.form.status = 'error';
        state.form.error = err.message;
      })
      .finally(() => updateView(state));
  });

  updateFeeds(state);
};
