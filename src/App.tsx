import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import BottomFade from "./components/BottomFade";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";
import useSmoothScroll from "./hooks/useSmoothScroll";
import { getLenis } from "./lib/lenis";
import { useContent } from "./cms/ContentProvider";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import HeroEditor from "./pages/admin/editors/HeroEditor";
import ShowcaseEditor from "./pages/admin/editors/ShowcaseEditor";
import BackgroundEditor from "./pages/admin/editors/BackgroundEditor";
import SkillsEditor from "./pages/admin/editors/SkillsEditor";
import ResumeEditor from "./pages/admin/editors/ResumeEditor";
import ProjectsEditor from "./pages/admin/editors/ProjectsEditor";
import ContactEditor from "./pages/admin/editors/ContactEditor";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  // A hard refresh (or pasting a URL with a hash) remounts the whole app, so
  // this ref is fresh on that first render — that's how we tell "the browser
  // just loaded this URL" apart from "the user navigated here in-app".
  const isFirstRender = useRef(true);

  // The browser's own scroll-restoration would otherwise snap back to
  // wherever the page was scrolled to before a refresh, fighting Lenis and
  // the sticky/pinned sections. We manage scroll position ourselves.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    const wasFirstRender = isFirstRender.current;
    isFirstRender.current = false;

    // Only chase a hash for in-app cross-route navigation (e.g. a case study's
    // CTA linking to /#start-project). On the very first render — a hard
    // refresh or a pasted URL — always land at the top instead: the sticky
    // hero and its entrance animation assume they start from scroll 0.
    if (hash && !wasFirstRender) {
      // Wait for the new page to render — the transition curtain hides the jump.
      const t = setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { offset: -96, immediate: true });
        else el.scrollIntoView();
      }, 350);
      return () => clearTimeout(t);
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

/** Keep the browser tab title in sync with editable content. */
function useDocTitle() {
  const { meta } = useContent();
  useEffect(() => {
    document.title = meta.title ? `${meta.name} — ${meta.title}` : meta.name;
  }, [meta.name, meta.title]);
}

/** The public marketing site, with all its chrome and smooth scroll. */
function SiteRoutes() {
  useSmoothScroll();
  return (
    <>
      <ScrollToTop />
      <PageTransition />
      <Navbar />
      <BottomFade />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case-studies/:slug" element={<CaseStudy />} />
        </Routes>
      </main>
    </>
  );
}

/** The CMS admin, a plain app shell without site chrome or smooth scroll. */
function AdminRoutes() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="hero" element={<HeroEditor />} />
        <Route path="showcase" element={<ShowcaseEditor />} />
        <Route path="background" element={<BackgroundEditor />} />
        <Route path="skills" element={<SkillsEditor />} />
        <Route path="resume" element={<ResumeEditor />} />
        <Route path="projects" element={<ProjectsEditor />} />
        <Route path="contact" element={<ContactEditor />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const { pathname } = useLocation();
  useDocTitle();
  return pathname.startsWith("/admin") ? <AdminRoutes /> : <SiteRoutes />;
}
