import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noIndex?: boolean;
  structuredData?: object | object[];
}

const BASE_TITLE = "شدج للجرافيك";
const BASE_URL = "https://shadj-graphics.space";
const DEFAULT_IMAGE = `${BASE_URL}/opengraph.jpg`;

export function useSEO({
  title,
  description,
  keywords,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  canonical,
  noIndex = false,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = `${BASE_TITLE} — ${title}`;

    document.title = fullTitle;

    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    if (keywords) setMeta("name", "keywords", keywords);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", canonical ? `${BASE_URL}${canonical}` : BASE_URL);

    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = `${BASE_URL}${canonical}`;
    }

    if (structuredData) {
      const existing = document.getElementById("page-structured-data");
      if (existing) existing.remove();
      const script = document.createElement("script");
      script.id = "page-structured-data";
      script.type = "application/ld+json";
      const data = Array.isArray(structuredData) ? structuredData : [structuredData];
      script.textContent = JSON.stringify(data.length === 1 ? data[0] : data);
      document.head.appendChild(script);
    }

    return () => {
      document.title = `${BASE_TITLE} | وكالة تصميم جرافيك احترافية — مصر والسعودية`;
    };
  }, [title, description, keywords, ogImage, ogType, canonical, noIndex]);
}

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}
