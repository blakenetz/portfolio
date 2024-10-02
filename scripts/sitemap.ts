import fs from "node:fs/promises";

import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import { format } from "date-fns";
import path from "path";

import { extractVFile, formatMeta } from "./util";

type NodeData = { [tagName: string]: string };

/**
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#xml
 */
export default async function createSiteMap() {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  const siteMapPath = path.resolve(".", "public/sitemap.xml");
  const blogDir = path.resolve(".", "app/blog");
  // trailing slash is important
  const urlBase = "https://blakenetzeband.com/";
  const blogBase = new URL("./blog", urlBase) + "/";

  const siteMap = await fs.readFile(siteMapPath, "utf-8");

  const document = parser.parseFromString(siteMap, "text/xml");
  const [urlsetNode] = document.getElementsByTagName("urlset");
  const urlNodes = document.getElementsByTagName("url");

  /** closure over `urlNodes`  */
  function getByLocation(location: string) {
    for (let i = 0; i < urlNodes.length; i++) {
      const node = urlNodes[i];
      if (node?.textContent?.trim() === location) {
        return node;
      }
    }

    return null;
  }

  /** closure over `document` */
  function generateUrlNode(data: NodeData) {
    const urlNode = document.createElement("url");

    Object.keys(data).forEach((tagName) => {
      const node = document.createElement(tagName);
      node.textContent = data[tagName];
      urlNode.appendChild(node);
    });

    return urlNode;
  }

  // iterate over routes
  ["", "projects/", "blog/"].forEach((route) => {
    const loc = new URL(`./${route}`, urlBase).toString();
    const today = format(new Date(), "MM-dd-yyyy");

    const node = getByLocation(loc);

    if (node) {
      const [lastmod] = node.getElementsByTagName("lastmod");
      lastmod.textContent = today;
    } else {
      const data: NodeData = { loc, lastmod: today };
      const urlNode = generateUrlNode(data);
      urlsetNode.appendChild(urlNode);
    }
  });

  // iterate over blog posts
  const posts = await fs.readdir(blogDir);
  for await (const post of posts) {
    const resolved = path.resolve(blogDir, post);
    const vFile = await extractVFile(resolved);

    const meta = formatMeta(vFile.data.matter);
    const loc = new URL(`./${meta.slug}`, blogBase).toString() + "/";

    // continue to next iteration if node exists
    if (getByLocation(loc)) continue;

    const data: NodeData = { loc, lastmod: format(meta.date, "MM-dd-yyyy") };
    const urlNode = generateUrlNode(data);

    urlsetNode.appendChild(urlNode);
  }

  await fs.writeFile(siteMapPath, serializer.serializeToString(document));
}

await createSiteMap()
  .catch((e) => console.log(e))
  .finally(() => process.exit());
