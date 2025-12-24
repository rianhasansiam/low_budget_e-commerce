export default function sitemap() {
  const baseUrl = 'https://digicammarket.com';

  // Static pages
  const routes = [
    '',
    '/about',
    '/contact',
    '/allProducts',
    '/wishList',
    '/addToCart',
    '/checkout',
    '/login',
    '/signup',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
