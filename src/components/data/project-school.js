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

const schoolProjects = {
	0: {
		name: 'The Jerk Project',
		description: 'A hybrid iOS app that measures changes in acceleration for cyclists and a corresponding map with a beer-related bonus feature.',
		specs: 'Ionic, iOS accelerometer and geo-locator, Node.js, Angular, Mapbox',
		links: {
			github: 'https://github.com/blakeface/jerkless',
			url: 'https://jerkmaps.herokuapp.com',
		}
	},
	1: {
		name: 'Whereabouts',
		description: 'A community-powered maps for overlooked points-of-interest.',
		specs: 'Socket.io, google Maps API, Node.js, Express, PostreSQL, Knex.js, Bootstrap, Passport and Passport Local',
		links: {
			github: 'https://github.com/blakeface/whereabouts',
			url: 'https://where-a-bouts.herokuapp.com',
		}
	},
	2: {
		name: 'Robot Xylophone',
		description: 'A robot xylophone conducted by anyone with internet access.',
		specs: 'Arduino Uno, Johnny-five.js, JWTS, Socket.io, Node.js, Express',
		links: {
			github: 'https://github.com/blakeface/xylophone-robot',
			youtube: 'https://www.youtube.com/watch?v=cuGgAqyMJ1M'
		}
	},
	3: {
		name: 'State of Solar',
		description: "This interactive website tracks solar energy deployment on a state-by-state basis. It's the first site I've ever built!",
		specs: 'RafaelJs, AJAX, JQuery, SCSS',
		links: {
			github: 'https://github.com/blakeface/state-of-solar',
			url: 'http://blakeface.github.io/state-of-solar',
		}
	}
}

export default schoolProjects