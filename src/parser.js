import i18next from 'i18next';

export default (rssContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssContent, 'application/xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error(i18next.t('errors.invalidRss'));
  }

  const channel = doc.querySelector('channel');
  if (!channel) {
    throw new Error(i18next.t('errors.invalidChannel'));
  }
  const elementTitle = channel.querySelector('title');
  const elementDescription = channel.querySelector('description');

  const element = {
    title: elementTitle ? elementTitle.textContent : 'No title',
    description: elementDescription ? elementDescription.textContent : 'No description',
  };

  const itemArray = Array.from(doc.querySelectorAll('item'));
  const items = itemArray.map((item) => {
    const itemTitle = item.querySelector('title');
    const itemLink = item.querySelector('link');
    const itemDescription = item.querySelector('description');

    return {
      title: itemTitle ? itemTitle.textContent : 'No title',
      link: itemLink ? itemLink.textContent : '',
      description: itemDescription ? itemDescription.textContent : '',
    };
  });

  return { element, items };
};
