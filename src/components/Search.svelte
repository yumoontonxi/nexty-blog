<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";

let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;

const fakeResult: SearchResult[] = [
	{
		url: url("/"),
		meta: {
			title: "This Is a Fake Search Result",
		},
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: url("/"),
		meta: {
			title: "If You Want to Test the Search",
		},
		excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
	},
];

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (!panel || !isDesktop) return;

	if (show) {
		panel.classList.remove("float-panel-closed");
	} else {
		panel.classList.add("float-panel-closed");
	}
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		return;
	}

	if (!initialized) {
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(keyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else if (import.meta.env.DEV) {
			searchResults = fakeResult;
		} else {
			searchResults = [];
			console.error("Pagefind is not available in production environment.");
		}

		result = searchResults;
		setPanelVisibility(result.length > 0, isDesktop);
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		setPanelVisibility(false, isDesktop);
	} finally {
		isSearching = false;
	}
};

onMount(() => {
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		if (keywordDesktop) search(keywordDesktop, true);
		if (keywordMobile) search(keywordMobile, false);
	};

	if (import.meta.env.DEV) {
		initializeSearch();
	} else {
		document.addEventListener("pagefindready", () => {
			initializeSearch();
		});
		document.addEventListener("pagefindloaderror", () => {
			initializeSearch();
		});

		setTimeout(() => {
			if (!initialized) {
				initializeSearch();
			}
		}, 2000);
	}
});

$: if (initialized && keywordDesktop) {
	(async () => {
		await search(keywordDesktop, true);
	})();
}

$: if (initialized && keywordMobile) {
	(async () => {
		await search(keywordMobile, false);
	})();
}
</script>

<!-- search bar for desktop view -->
<div id="search-bar" class="search-bar relative hidden w-44 items-center md:flex">
    <span class="search-icon pointer-events-none absolute left-3 flex h-4 w-4 items-center justify-center">
        <Icon icon="material-symbols:search" class="h-4 w-4"></Icon>
    </span>
    <input placeholder="{i18n(I18nKey.search)}" bind:value={keywordDesktop} on:focus={() => search(keywordDesktop, true)}
           class="search-input w-full pl-9"
    >
</div>

<!-- toggle btn for phone/tablet view -->
<button on:click={togglePanel} aria-label="Search Panel" id="search-switch"
        class="search-mobile-btn flex h-10 w-10 items-center justify-center md:hidden">
    <Icon icon="material-symbols:search" class="text-xl"></Icon>
</button>

<!-- search panel -->
<div id="search-panel" class="float-panel float-panel-closed search-panel absolute right-4 top-14 p-2 md:left-[unset] md:w-80">

    <div id="search-bar-inside" class="search-bar relative flex h-8 items-center md:hidden">
        <span class="search-icon pointer-events-none absolute left-2.5 flex items-center justify-center text-base">
            <Icon icon="material-symbols:search"></Icon>
        </span>
        <input placeholder="Search" bind:value={keywordMobile}
               class="search-input absolute inset-0 pl-8 pr-2 text-sm"
        >
    </div>

    {#each result as item}
        <a href={item.url}
           class="search-result block px-3 py-2 first-of-type:mt-2 md:first-of-type:mt-0">
            <div class="search-result-title">
                {item.meta.title}
            </div>
            <div class="search-result-excerpt">
                {@html item.excerpt}
            </div>
        </a>
    {/each}
</div>

<style>
  .search-bar {
    background: var(--search-bg);
    border-radius: var(--search-radius);
    padding: 8px 12px;
    border: none;
  }

  .search-input {
    font-family: var(--font-text);
    font-size: 14px;
    font-weight: 400;
    color: var(--text-primary);
    background: transparent;
    outline: none;
    border: none;
  }

  .search-input::placeholder {
    color: var(--text-tertiary);
  }

  .search-icon {
    color: var(--text-tertiary);
  }

  .search-mobile-btn {
    color: var(--text-secondary);
    transition: color var(--duration-fast) ease;
  }

  .search-mobile-btn:hover {
    color: var(--text-primary);
  }

  .search-panel {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.1));
    border-radius: var(--search-radius);
  }

  .search-result {
    text-decoration: none;
    transition: background var(--duration-fast) ease;
  }

  .search-result:hover {
    background: var(--row-hover-bg, rgba(0, 0, 0, 0.03));
  }

  .search-result-title {
    font-size: 14px;
    color: var(--text-primary);
  }

  .search-result-excerpt {
    font-size: 12px;
    color: var(--text-tertiary);
  }

  input:focus {
    outline: 0;
  }
</style>
