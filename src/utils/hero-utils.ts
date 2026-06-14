import { getCollection } from "astro:content";
import path from "node:path";
import { getDir, getPostUrlBySlug, url } from "./url-utils";

export type HeroSlide = {
	slug: string;
	title: string;
	image: string;
	caption: string;
	href: string;
};

function isHeroFlag(hero: unknown): boolean {
	return hero === true || hero === "true";
}

export function resolvePostImageSrc(image: string, postId: string): string {
	if (!image) return "";
	if (
		image.startsWith("http://") ||
		image.startsWith("https://") ||
		image.startsWith("data:")
	) {
		return image;
	}
	if (image.startsWith("/")) {
		return url(image);
	}
	const dir = getDir(postId);
	return url(
		path.posix.join("/posts-assets", dir, image).replace(/\\/g, "/"),
	);
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
	const posts = await getCollection("posts", ({ data }) => {
		if (!isHeroFlag(data.hero)) return false;
		if (import.meta.env.PROD && data.draft) return false;
		return Boolean(data.image);
	});

	return posts
		.sort((a, b) => b.data.published.getTime() - a.data.published.getTime())
		.map((post) => ({
			slug: post.slug,
			title: post.data.title,
			image: resolvePostImageSrc(post.data.image, post.id),
			caption: post.data.heroCaption || "",
			href: getPostUrlBySlug(post.slug),
		}));
}
