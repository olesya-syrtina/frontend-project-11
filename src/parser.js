export default (rssContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssContent, 'application/xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Ресурс не содержит валидный RSS');
  }

  const channel = doc.querySelector('channel');
  if (!channel) {
    throw new Error('Некорректный RSS: отсутствует элемент channel');
  }
  const titleElement = channel.querySelector('title');
  const descriptionElement = channel.querySelector('description');

  const feed = {
    title: titleElement ? titleElement.textContent : 'No title',
    description: descriptionElement ? descriptionElement.textContent : 'No description',
  };

  const items = Array.from(doc.querySelectorAll('item'));
  const posts = items.map((item) => {
    const postTitleElement = item.querySelector('title');
    const postLinkElement = item.querySelector('link');
    const postDescriptionElement = item.querySelector('description');

    return {
      title: postTitleElement ? postTitleElement.textContent : 'No title',
      link: postLinkElement ? postLinkElement.textContent : '',
      description: postDescriptionElement ? postDescriptionElement.textContent : '',
    };
  });

  return { feed, posts };
};
