import React from "react";
import ReactDOM from "react-dom/client";
import EirimFrontDesk from "./EirimFrontDesk.jsx";
import Telehealth from "./Telehealth.jsx";
import Chatbot from "./Chatbot.jsx";
import Admin from "./Admin.jsx";
import ProductPage, { ProductsIndex } from "./ProductPage.jsx";
import SpecialtyPage, { SpecialtiesIndex } from "./SpecialtyPage.jsx";
import { BlogIndex, BlogPost } from "./Blog.jsx";
import AiAgentsRcm from "./AiAgentsRcm.jsx";
import { track } from "./track.js";

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

// Self-referencing canonical per route. Navigation is via full page loads, so
// setting this once per load from the current path covers every page.
(() => {
  const url = "https://medxflow.ai" + (path || "/");
  let c = document.querySelector('link[rel="canonical"]');
  if (!c) { c = document.createElement("link"); c.rel = "canonical"; document.head.appendChild(c); }
  c.setAttribute("href", url);
})();

// Log public traffic (never the admin page itself).
if (!isAdmin) track();

function App() {
  if (isAdmin) return <Admin />;
  if (isTelehealth) {
    return (
      <>
        <Telehealth />
        <Chatbot />
      </>
    );
  }
  if (isProductsIndex) {
    return (
      <>
        <ProductsIndex />
        <Chatbot />
      </>
    );
  }
  if (productMatch) {
    return (
      <>
        <ProductPage slug={productMatch[1]} />
        <Chatbot />
      </>
    );
  }
  if (isSpecialtiesIndex) {
    return (
      <>
        <SpecialtiesIndex />
        <Chatbot />
      </>
    );
  }
  if (specialtyMatch) {
    return (
      <>
        <SpecialtyPage slug={specialtyMatch[1]} />
        <Chatbot />
      </>
    );
  }
  if (isBlogIndex) {
    return (
      <>
        <BlogIndex />
        <Chatbot />
      </>
    );
  }
  if (blogMatch) {
    return (
      <>
        <BlogPost slug={blogMatch[1]} />
        <Chatbot />
      </>
    );
  }
  if (isAiAgentsRcm) {
    return (
      <>
        <AiAgentsRcm />
        <Chatbot />
      </>
    );
  }
  return (
    <>
      <EirimFrontDesk />
      <Chatbot />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
