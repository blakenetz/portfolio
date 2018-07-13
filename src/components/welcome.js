import paper from 'paper'

export default {
	data () {
		return {
			paper: null, //paperObject
			scaleFactor: 1,
			positionX: 0,
			positionY: 0,
		}
	},

	methods: {
		setScale: function(faceWidth) {
			this.scaleFactor = (window.innerWidth / 3.5) / faceWidth
		},
		setPosition: function() {
			this.positionX = window.innerWidth / 3.5
			this.positionY = window.innerHeight / 2
		},
	},

	created() {
		paper.install(window) // unfortunately need to attach paper to global scope
	},

	mounted() {
		this.paper = paper.setup('paper-canvas')

		// GLASSES
		const leftGlass = new Path.Circle({
			center: [100, 150],
			radius: 50,
		})
		const rightGlass = leftGlass.clone()
		rightGlass.position.x += (rightGlass.bounds.width * 1.5)
		const bridge = new Path.Arc({
			from: [leftGlass.bounds.rightCenter.x, leftGlass.bounds.rightCenter.y],
			through: [leftGlass.bounds.rightCenter.x * 1.33, leftGlass.bounds.rightCenter.y * 0.99],
			to: [rightGlass.bounds.leftCenter.x, rightGlass.bounds.leftCenter.y],
		});
		const glasses = new Group({
			children: [rightGlass, bridge, leftGlass],
			strokeColor: '#303a49',
			strokeWidth: 10,
		})

		// EYES
		const leftEye = leftGlass.clone()
		leftEye.scale(0.5)
		const rightEye = rightGlass.clone()
		rightEye.scale(0.5)
		const eyes = new Group({
			children: [rightEye, leftEye],
			strokeColor: 'white',
			strokeWidth: 20,
			fillColor: 'navy',
		})

		// NOSE
		const nose = new Path({
			strokeColor: '#FFFFFF',
			strokeWidth: 7,
		});
		nose.add(
			{
				// top of nose
				x: leftGlass.bounds.rightCenter.x,
				y: leftGlass.bounds.rightCenter.y - leftGlass.bounds.height
			},
			{
				// tip of nose
				x: rightGlass.bounds.leftCenter.x,
				y: rightGlass.bounds.leftCenter.y + rightGlass.bounds.height
			},
			{
				// nostril
				x: leftGlass.bounds.leftCenter.x + (leftGlass.bounds.width / 2),
				y: rightGlass.bounds.leftCenter.y + leftGlass.bounds.height
			}
		)

		// HEAD
		const head = new Path.RegularPolygon({
			center: [glasses.bounds.center.x, glasses.bounds.center.y + glasses.bounds.height/3],
			sides: 30,
			radius: glasses.bounds.width / 2.2,
			fillColor: '#8AFEE1'
		})
		head.scale(1.05, 1.35)

		// FACE - GROUP ALL ITEMS
		const face = new Group({
			children: [head, nose, eyes, glasses],
		})
		this.setPosition()
		face.position = new Point(this.positionX, this.positionY)
		this.setScale(face.bounds.width)
		face.scale(this.scaleFactor, this.scaleFactor)

		// ANIMATE
		this.paper.view.onFrame = (e) => {
			// eyes
			for (var i = eyes.children.length - 1; i >= 0; i--) {
				for (var j = eyes.children[i].segments.length - 1; j >= 0; j--) {
					eyes.children[i].segments[j].point.x += Math.random() * 0.4 - 0.2
				}
				eyes.children[i].rotate(0.1);
			}
			// head
			for (var i = head.segments.length - 1; i >= 0; i--) {
				head.segments[i].point.x += Math.random() * 0.4 - 0.2
			}
		}
		// ON RESIZE
		this.paper.view.onResize = (e) => {
			this.setPosition()
			face.position = new Point(this.positionX, this.positionY)

			this.setScale(face.bounds.width)
			face.scale(this.scaleFactor, this.scaleFactor)
		}
	}
}