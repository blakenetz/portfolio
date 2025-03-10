# Portfolio

My chunk of the internet.

Live at [blakenetzeband . com](https://blakenetzeband.com)

[![Netlify Status](https://api.netlify.com/api/v1/badges/9a4607e6-979a-4bca-9eb0-560b505f3c9f/deploy-status)](https://app.netlify.com/sites/blake-netzeband-portfolio/deploys)

## Specs

- [Astro](https://astro.build)
- [Mdx](https://mdxjs.com/)
- [TailwindCSS](https://tailwindcss.com)
- [Netflify](https://www.netlify.com)

### Caching

3 layers of caching:

- Development server-side: [unstorage](https://unstorage.unjs.io/)
- Production server-side: [lru-cache](https://leetcode.com/problems/lru-cache/description/)
- HTTP caching: [header declarations](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)

## Callouts

- Full accessibly
- [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
