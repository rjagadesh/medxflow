import React from "react";
import ReactDOM from "react-dom/client";
import EirimFrontDesk from "./EirimFrontDesk.jsx";
import { SEO_PAGES } from "./seo-pages.data.js";
import { track } from "./track.js";

// Only the homepage (EirimFrontDesk) and the tiny routing data load eagerly.
// Every other route - and its heavy data (blog/glossary/denial codes) and the
// whole admin/social sub-tree - is code-split, so a public visitor landing on
// the homepage downloads just the homepage, not the entire site.
const Admin = React.lazy(() => import("./Admin.jsx"));
const Telehealth = React.lazy(() => import("./Telehealth.jsx"));
const Chatbot = React.lazy(() => import("./Chatbot.jsx"));
const ProductPage = React.lazy(() => import("./ProductPage.jsx"));
const ProductsIndex = React.lazy(() => import("./ProductPage.jsx").then((m) => ({ default: m.ProductsIndex })));
const SpecialtyPage = React.lazy(() => import("./SpecialtyPage.jsx"));
const SpecialtiesIndex = React.lazy(() => import("./SpecialtyPage.jsx").then((m) => ({ default: m.SpecialtiesIndex })));
const BlogIndex = React.lazy(() => import("./Blog.jsx").then((m) => ({ default: m.BlogIndex })));
const BlogPost = React.lazy(() => import("./Blog.jsx").then((m) => ({ default: m.BlogPost })));
const AiAgentsRcm = React.lazy(() => import("./AiAgentsRcm.jsx"));
const SeoPage = React.lazy(() => import("./SeoPage.jsx"));
const GlossaryIndex = React.lazy(() => import("./Glossary.jsx").then((m) => ({ default: m.GlossaryIndex })));
const GlossaryTerm = React.lazy(() => import("./Glossary.jsx").then((m) => ({ default: m.GlossaryTerm })));
const DenialCodesIndex = React.lazy(() => import("./DenialCodes.jsx").then((m) => ({ default: m.DenialCodesIndex })));
const DenialCodePage = React.lazy(() => import("./DenialCodes.jsx").then((m) => ({ default: m.DenialCodePage })));
const DenialRateCalculator = React.lazy(() => import("./DenialRateCalculator.jsx"));
const RcmDenialBenchmarks = React.lazy(() => import("./RcmDenialBenchmarks.jsx"));
const NpiLookup = React.lazy(() => import("./NpiLookup.jsx"));
const About = React.lazy(() => import("./About.jsx"));
const Trust = React.lazy(() => import("./Trust.jsx"));

const path = window.location.pathname.replace(/\/+$/, "");
const isAdmin = path === "/admin";
const isTelehealth = path === "/telehealth";
const isProductsIndex = path === "/products";
const productMatch = path.match(/^\/products\/([a-z0-9-]+)$/);
const isSpecialtiesIndex = path === "/specialties";
const specialtyMatch = path.match(/^\/specialties\/([a-z0-9-]+)$/);
const isBlogIndex = path === "/blog";
const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
const isAiAgentsRcm = path === "/ai-agents-rcm";
const seoSlug = SEO_PAGES.some((p) => `/${p.slug}` === path) ? path.slice(1) : null;
const isGlossaryIndex = path === "/glossary";
const glossaryMatch = path.match(/^\/glossary\/([a-z0-9-]+)$/);
const isDenialIndex = path === "/denial-codes";
const denialMatch = path.match(/^\/denial-codes\/([a-z0-9-]+)$/);
const isDenialCalc = path === "/denial-rate-calculator";
const isDenialBenchmarks = path === "/rcm-denial-benchmarks";
const isNpiLookup = path === "/npi-lookup";
const isAbout = path === "/about";
const isTrust = path === "/trust";

// Self-referencing canonical per route. Navigation is via full page loads, so
// setting this once per load from the current path covers every page.
(() => {
  // Match the prerendered canonical: trailing slash on sub-pages, bare "/" home.
  const url = "https://medxflow.ai" + (path ? path + "/" : "/");
  let c = document.querySelector('link[rel="canonical"]');
  if (!c) { c = document.createElement("link"); c.rel = "canonical"; document.head.appendChild(c); }
  c.setAttribute("href", url);
})();

// Log public traffic (never the admin page itself).
if (!isAdmin) track();

// Chatbot is a floating widget, never above the fold - load it lazily so it
// never blocks first paint, on the homepage or anywhere else.
const Chat = () => (
  <React.Suspense fallback={null}>
    <Chatbot />
  </React.Suspense>
);

// Full-page fallback while a code-split route chunk downloads. The homepage is
// eager, so it never shows this.
function Page({ children }) {
  return (
    <>
      <React.Suspense fallback={<div style={{ minHeight: "70vh", display: "grid", placeItems: "center", color: "#8aa" }}>Loading…</div>}>
        {children}
      </React.Suspense>
      <Chat />
    </>
  );
}

function App() {
  if (isAdmin) return (
    <React.Suspense fallback={<div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#8aa" }}>Loading…</div>}>
      <Admin />
    </React.Suspense>
  );
  if (isTelehealth) return <Page><Telehealth /></Page>;
  if (isProductsIndex) return <Page><ProductsIndex /></Page>;
  if (productMatch) return <Page><ProductPage slug={productMatch[1]} /></Page>;
  if (isSpecialtiesIndex) return <Page><SpecialtiesIndex /></Page>;
  if (specialtyMatch) return <Page><SpecialtyPage slug={specialtyMatch[1]} /></Page>;
  if (isBlogIndex) return <Page><BlogIndex /></Page>;
  if (blogMatch) return <Page><BlogPost slug={blogMatch[1]} /></Page>;
  if (isAiAgentsRcm) return <Page><AiAgentsRcm /></Page>;
  if (seoSlug) return <Page><SeoPage slug={seoSlug} /></Page>;
  if (isGlossaryIndex) return <Page><GlossaryIndex /></Page>;
  if (glossaryMatch) return <Page><GlossaryTerm slug={glossaryMatch[1]} /></Page>;
  if (isDenialIndex) return <Page><DenialCodesIndex /></Page>;
  if (denialMatch) return <Page><DenialCodePage slug={denialMatch[1]} /></Page>;
  if (isDenialCalc) return <Page><DenialRateCalculator /></Page>;
  if (isDenialBenchmarks) return <Page><RcmDenialBenchmarks /></Page>;
  if (isNpiLookup) return <Page><NpiLookup /></Page>;
  if (isAbout) return <Page><About /></Page>;
  if (isTrust) return <Page><Trust /></Page>;
  return (
    <>
      <EirimFrontDesk />
      <Chat />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
