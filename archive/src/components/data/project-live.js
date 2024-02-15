// basic shape:
// {
// 	name: string,
// 	description: string,
// 	specs: string,
// 	links: {
// 		github: string,
// 		url: string,
// 		youtube: string,
// 		pics: string,
// 		linkedin: string,
// 	}
// }

const liveProjects = {
	0: {
		name: "Banana Phone",
		description:
			"Banana Phone is a banana-shaped, Bluetooth-enabled, mobile handset that connects to your smartphone and interact with your voice assistant.",
		specs:
			"React, Webpack, AWS Route 53, AWS S3, AWS Elastic Beanstalk, Node, SCSS, Image compression tools",
		links: {
			github: "https://github.com/blakeface/banana-phone",
			url: "http://www.bananaphone.io"
		}
	},
	1: {
		name: "Portfolio",
		description: "You're looking at it...",
		specs: "Vue, Webpack 4, Paper.js, ScrollReveal, Image compression tools",
		links: {
			github: "https://github.com/blakeface/portfolio"
		}
	},
	2: {
		name: "SurveyGizmo",
		description:
			"I dedicated 2 beautiful years as a CX developer. Outside of app development (specs listed below), I assisted with usability tests, building test suites, increasing site accessibility (WCAG AAA compliant), and mentored. 🤗",
		specs:
			"PHP, Elastic Search, MySQL, jQuery, Backbone.js, R, Ruby, Capybara, PhantomJS, Puppeteer",
		links: {
			url: "https://www.surveygizmo.com/",
			linkedin: "https://www.linkedin.com/company/712662",
			youtube: "https://www.youtube.com/user/SurveyGizmo/playlists"
		}
	},
	3: {
		name: "BETSOL",
		description:
			"I created some neat websites for a client who requested not to be named. For these sites, I did the whole enchilada, from designing a suite of prototypes to deploying on an old Windows server (I know, not my first choice either). Take a gander at my Behance profile for some of my mockups",
		specs:
			"React, React Router, Redux, Material-UI, Webpack, Node, Express, Postgres, Docker, Adobe XD",
		links: {
			linkedin: "https://www.linkedin.com/company/betsol",
			behance: "https://www.behance.net/blakeface"
		}
	},
	4: {
		name: "Spire Digital",
		description: "Building a neat stuff with a 100% Javascript stack!",
		specs: "React, React Router, Webpack, Node, Express, Postgres, Open Layers",
		links: {
			url: "https://www.spiredigital.com/",
			linkedin: "https://www.linkedin.com/company/spire-digital-/"
		}
	}
};

export default liveProjects;
