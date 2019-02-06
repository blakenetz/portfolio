<template>
	<main>
		<welcome/>
		<projects :data="data" :maxBoxCount="maxBoxCount"/>
		<skills :data="skillData" :links="links"/>
	</main>
</template>

<script>
	// global style
	import "../assets/stylesheets/global.css";
	// components
	import welcome from "./components/welcome.vue";
	import projects from "./components/projects.vue";
	import skills from "./components/skills.vue";
	// data - projects
	import liveProjects from "./components/data/project-live.js";
	import schoolProjects from "./components/data/project-school.js";
	import wipProjects from "./components/data/project-wip.js";
	import funProjects from "./components/data/project-fun.js";
	// data - skills
	import skillData from "./components/data/skills-skills.js";
	// props
	const minBoxCount = 4; // hard coded for now. not really needed to loop through every project
	const maxBoxCount =
		parseInt(window.innerWidth / 128) > minBoxCount
			? parseInt((window.innerWidth - 64) / 128) // (window - padding) / projectSquare
			: minBoxCount;
	const data = {
		0: {
			displayName: "In The Wild",
			data: liveProjects,
			rgb: "208, 143, 140"
		},
		1: {
			displayName: "Escuela",
			data: schoolProjects,
			rgb: "78, 111, 133"
		},
		2: {
			displayName: "Work In Progress",
			data: wipProjects,
			rgb: "81, 145, 114"
		},
		3: {
			displayName: "Just For Fun",
			data: funProjects,
			rgb: "208, 168, 117"
		}
	};
	const links = [
		{
			href: "https://github.com/blakeface",
			icon: "fa-github"
		},
		{
			href: "https://medium.com/@blakeface",
			icon: "fa-medium"
		},
		{
			href: "https://www.behance.net/blakeface",
			icon: "fa-behance"
		},
		{
			href: "https://www.linkedin.com/in/blakenetz",
			icon: "fa-linkedin"
		},
		{
			href: "mailto:blake.netzeband@gmail.com",
			icon: "fa-envelope"
		}
	];

	export default {
		components: {
			welcome,
			projects,
			skills
		},
		data() {
			return {
				data,
				maxBoxCount,
				skillData,
				links
			};
		}
	};
</script>