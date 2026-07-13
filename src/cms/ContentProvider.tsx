import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CONTENT_VERSION, defaultContent, type SiteContent } from "./content";

// Versioned key: bumping CONTENT_VERSION retires stale local edits whose
// shape no longer matches the site (old sections would otherwise shadow a
// restructured default content).
const STORAGE_KEY = `portfolio-cms-content-v${CONTENT_VERSION}`;

/** Recursively fill missing keys from `base`, letting `override` win where it
 * provides a value. Arrays and primitives are taken wholesale from override. */
function deepMerge<T>(base: T, override: unknown): T {
  if (
    typeof base !== "object" ||
    base === null ||
    Array.isArray(base) ||
    typeof override !== "object" ||
    override === null ||
    Array.isArray(override)
  ) {
    return (override === undefined ? base : (override as T)) ?? base;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  const ov = override as Record<string, unknown>;
  for (const key of Object.keys(out)) {
    if (key in ov) {
      out[key] = deepMerge(
        (base as Record<string, unknown>)[key],
        ov[key]
      );
    }
  }
  return out as T;
}

function loadStored(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    return deepMerge(defaultContent, JSON.parse(raw));
  } catch {
    return defaultContent;
  }
}

type Cms = {
  content: SiteContent;
  /** Mutate a structured-clone draft, then commit. */
  update: (mutator: (draft: SiteContent) => void) => void;
  reset: () => void;
  exportJson: () => void;
  importJson: (raw: string) => { ok: boolean; error?: string };
  isCustomised: boolean;
  storageError: string | null;
};

const ContentContext = createContext<Cms | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadStored);
  const [isCustomised, setIsCustomised] = useState(
    () => !!localStorage.getItem(STORAGE_KEY)
  );
  const [storageError, setStorageError] = useState<string | null>(null);
  const first = useRef(true);

  // Persist on every change (skip the initial mount).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setIsCustomised(true);
      setStorageError(null);
    } catch {
      setStorageError(
        "Couldn’t save — browser storage is full. Large images are the usual cause; use image URLs instead of uploads, or export your content to a file."
      );
    }
  }, [content]);

  const update = useCallback(
    (mutator: (draft: SiteContent) => void) => {
      setContent(prev => {
        const draft = structuredClone(prev);
        mutator(draft);
        return draft;
      });
    },
    []
  );

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setContent(structuredClone(defaultContent));
    setIsCustomised(false);
    setStorageError(null);
  }, []);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-content.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const importJson = useCallback((raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      setContent(deepMerge(defaultContent, parsed));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }, []);

  const value = useMemo<Cms>(
    () => ({
      content,
      update,
      reset,
      exportJson,
      importJson,
      isCustomised,
      storageError,
    }),
    [content, update, reset, exportJson, importJson, isCustomised, storageError]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

/** Read-only site content for display components. */
export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx.content;
}

/** Full CMS API for the admin editors. */
export function useCms() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useCms must be used within ContentProvider");
  return ctx;
}
