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

  const links = posts
    .sort((a, b) => b.score - a.score)
    .map(post => post.raw.match(/(https?:\/\/[^\s)]+)/g))
    .flat()
    .filter(Boolean)
    .slice(0, 10);

  const previews = await Promise.all(links.map(async link => {
    if (cache[link]) {
      return cache[link];
    }

    const { body } = await got(link);
    const $ = cheerio.load(body);

    const titleTag = $('head title').text();
    const titleMeta = $('head meta[property="og:title"]').attr('content');
    const title = titleMeta || titleTag;

    const descriptionMeta = $('head meta[property="og:description"]').attr('content');
    const descriptionTag = $('head meta[property="description"]').text();
    const description = descriptionMeta ? descriptionMeta : descriptionTag;

    const image = $('meta[property="og:image"]').attr('content');

    cache[link] = { title, description, image, url: link };
    return cache[link];
  }));

  res.json(previews);
}