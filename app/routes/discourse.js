import _ from 'lodash';
import got from 'got';
import cheerio from 'cheerio';

const cache = {};

export async function links(req, res, next) {
  const { body: response } = await got('https://discourse.ecult.org/posts.json', {
    headers: {
      'Api-Key': process.env.DISCOURSE_API_KEY,
      'Api-Username': 'system'
    },
    json: true
    
  });

  const posts = response.latest_posts;

  let links = posts
    .sort((a, b) => b.score - a.score)
    .map(post => post.raw.match(/(https?:\/\/[^\s)]+)/g))
    .flat()
    .filter(Boolean);

  links = _.uniqBy(links, link => (new URL(link)).hostname).slice(0, 10);

  const previews = (await Promise.all(links.map(async link => {
    if (cache[link]) {
      return cache[link];
    }

    const { body } = await got(link);
    const $ = cheerio.load(body);

    const titleTag = $('head title').text();
    const titleMeta = $('head meta[property="og:title"]').attr('content');
    const titleSiteMeta = $('head meta[property="og:site_name"]').attr('content');
    const title = titleMeta || titleTag || titleSiteMeta;
    
    if (!title) {
      return;
    }

    const descriptionMeta = $('head meta[property="og:description"]').attr('content');
    const descriptionTag = $('head meta[name="description"]').attr('content');
    const description = descriptionMeta ? descriptionMeta : descriptionTag;

    const imageMeta = $('head meta[property="og:image"]').attr('content');
    const imageFavicon = $('head link[rel*="icon"]').attr('href');
    let image = imageMeta || imageFavicon;

    if (image && !image.startsWith('http')) {
      const relativePath = image;
      const url = new URL(link);
      const protocol = url.protocol;
      const hostname = url.hostname;
      let basePath = `${protocol}//${hostname}`;
      if (!image.startsWith('/')) {
        basePath += '/';
      }
      image = basePath + relativePath;
    }

    cache[link] = { title, description, image, url: link };
    return cache[link];
  }))).filter(Boolean);

  res.json(previews);
}