import type { ProjectItem } from "~/types/projects";
import { getImage } from "astro:assets";
import Flower from "~/assets/flower.svg";
import Discover from "~/assets/projects/discover.png";
import TheSignatry from "~/assets/projects/the-signatry.png";
import OnWater from "~/assets/projects/onwater.png";
import Cms from "~/assets/projects/cms.svg";
import BananaPhone from "~/assets/projects/banana-phone.png";

export const projects: ProjectItem[] = [
  {
    title: "Portfolio",
    timeFrame: 2025,
    description:
      "You're looking at it! This project has lived many lives, including as a Vue, Remix, and now Astro project.",
    techStack: ["Astro", "Tailwind", "TypeScript", "Web Components"],
    link: "https://github.com/blakenetz/portfolio",
    image: await getImage({ src: Flower, fit: "cover" }),
  },
  {
    title: "Discover Financial Services",
    timeFrame: [2022, 2024],
    role: "Senior Software Developer",
    description:
      "Brought in as a frontend specialist, I built a fully accessible and extendable React UI library. I focused on crafting the base theming system, a multi-faceted testing framework, and a variety of scripts to reduce development time. I also extensively mentored intra/inter-team members, drafted ADRs and wrote blog posts on modern frontend technologies and techniques.",
    employer: "Kin + Carta",
    techStack: [
      "React",
      "Typescript",
      "Web Components",
      "Playwright",
      "Jest",
      "Jenkins",
    ],
    image: await getImage({ src: Discover, fit: "cover" }),
  },
  {
    title: "The Signatry",
    timeFrame: [2021, 2022],
    role: "Senior Software Developer",
    description:
      "Onboarded to fight fires, I restored this project by unifying the dev team and promoting high quality code. I also generated numerous scripts to automate recurring SQL queries and facilitate knowledge-sharing.",
    employer: "Kin + Carta",
    techStack: ["React", "Typescript", "TypeORM", "GraphQL", "PostgreSQL"],
    image: await getImage({
      src: TheSignatry,
      type: "image/png",
      fit: "cover",
    }),
  },
  {
    title: "OnWater",
    timeFrame: [2020, 2021],
    role: "Tech Lead",
    description:
      "After massive staffing issues, I was assigned as the sole developer for this project that included both web and native platforms. I rebuilt the entire React Native codebase and reconfigured the state management from a global to a modular approach. I successfully deployed to the App Store and Google Play, created a testing and deployment pipeline, and wrote the technical docs.",
    employer: "Kin + Carta",
    techStack: [
      "React",
      "React Native",
      "TypeORM",
      "GraphQL",
      "PostgreSQL",
      "PostGIS",
    ],
    image: await getImage({ src: OnWater, fit: "cover" }),
  },
  {
    title: "CMS Environmental Services",
    timeFrame: [2019, 2020],
    role: "Individual Contributor",
    description:
      "Alongside 2 other developers, we built an app that digitalized the processes around Colorado’s water regulations.",
    employer: "Kin + Carta",
    techStack: ["React", "Express", "Node.js", "PostgreSQL"],
    image: await getImage({ src: Cms, fit: "cover" }),
  },
  {
    title: "Banana Phone",
    timeFrame: 2014,
    role: "Tech Advisor and Developer",
    description:
      "A fun project where I designed, developed, and deployed a marketing website for my friend. Technical hurdles included localization and slimming the tech stack for cost reduction.",
    techStack: [
      "React",
      "Webpack",
      "ES6",
      "SCSS",
      "Node.js",
      "Express",
      "AWS Elastic Beanstalk",
      "AWS S3",
      "AWS Cloudfront",
    ],
    link: "https://github.com/blakenetz/banana-phone",
    image: await getImage({
      src: BananaPhone,
      type: "image/png",
      fit: "cover",
    }),
  },
];
