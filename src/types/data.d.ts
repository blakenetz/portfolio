type Link =
	| "github"
	| "url"
	| "youtube"
	| "pics"
	| "linkedin"
	| "behance"
	| "medium";

interface ProjectData {
	name: string;
	description: string;
	specs?: string;
	links?: Partial<Record<Link, string>>;
}

interface SkillData {
	category: string;
	skills: string[];
}

interface SkillLink {
	href: string;
	icon: string;
}
