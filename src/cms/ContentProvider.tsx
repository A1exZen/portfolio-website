import { createContext, useContext, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "./content";

const ContentContext = createContext<SiteContent>(defaultContent);

/**
 * Site content comes straight from `defaultContent` in content.ts — there is
 * no client-side editing or persistence layer. Editing the site's copy means
 * editing that file directly, so what's in the repo is always exactly what's
 * live: no localStorage cache that can silently shadow a code change.
 */
export function ContentProvider({ children }: { children: ReactNode }) {
	return (
		<ContentContext.Provider value={defaultContent}>
			{children}
		</ContentContext.Provider>
	);
}

export function useContent() {
	return useContext(ContentContext);
}
