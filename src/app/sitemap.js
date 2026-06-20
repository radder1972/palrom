export default function sitemap() {
  const baseUrl = 'https://palromproducts.com';
  
  const routes = [
    '',
    '/about',
    '/products',
    '/configurator',
    '/blanks',
    '/four-sides-planed',
    '/rods',
    '/profiles',
    '/specials',
    '/brichete-fag',
    '/careers',
    '/apply',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
