import paper from 'paper'

export default {
	props: ['data'],
	mounted() {
		this.paper = paper.setup('paper-canvas-skills')

		const clickShape = new Path({
			strokeColor: '#8AFEE1',
			strokeWidth: 15,
			strokeCap: 'round',
		});

		this.paper.view.onClick = (e) => {
			clickShape.add(e.point)
		}

		this.paper.view.onDoubleClick = (e) =>  {
			clickShape.strokeColor.hue = Math.random() * 360;
		}

	}
}