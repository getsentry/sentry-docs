import {getChangelogs} from 'app/changelog/page';
import RSS from 'rss';

export async function GET() {
  const feed = new RSS({
    title: 'Sentry Changelog',
    description:
      'Stay up to date on everything big and small, from product updates to SDK changes with the Sentry Changelog.',
    feed_url: 'https://sentry.io/changelog/feed.xml',
    site_url: 'https://sentry.io/changelog',
    copyright: `Copyright ${new Date().getFullYear().toString()}, Sentry`,
    language: 'en-US',
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  const allChangelogs = await getChangelogs();

  if (allChangelogs) {
    allChangelogs.map(changelog => {
      return feed.item({
        title: changelog.title,
        description: changelog.summary,
        url: `https://sentry.io/changelog/${changelog.slug}`,
        categories:
          changelog.categories.map(category => {
            return category.name;
          }) || [],
        date: changelog.publishedAt,
      });
    });
  }

  return new Response(feed.xml({indent: true}), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
