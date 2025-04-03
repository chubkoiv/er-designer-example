import { Component, computed, inject, Input, Signal } from '@angular/core';
import { Guid } from 'guid-typescript';
import { CommonStore } from '../../ngrx/common.store';

@Component({
	selector: 'app-connection-line',
	standalone: true,
	template: `
		<svg class="absolute w-full h-full pointer-events-none">
			<defs>
				<marker
					id="arrow"
					viewBox="0 0 10 10"
					refX="10"
					refY="5"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" fill="green"></path>
				</marker>
			</defs>

			<path
				[attr.d]="path()"
				[attr.stroke-width]="2.0"
				[attr.stroke]="lineColor"
				fill="none"
				marker-end="url(#arrow)"
			></path>

			<circle
				[attr.cx]="sourceX()"
				[attr.cy]="sourceY()"
				r="5"
				fill="green"
			></circle>
		</svg>
	`,
})
export class ConnectionLineComponent {
	@Input() sourceId!: Guid;
	@Input() targetId!: Guid;
	lineColor = 'green';
	private store = inject(CommonStore);
	sourceNode = computed(() => this.store.getNodeById(this.sourceId));
	targetNode = computed(() => this.store.getNodeById(this.targetId));
	private nodeWidth = 160;
	sourceX = computed(() => {
		const source = this.sourceNode();
		const target = this.targetNode();
		if (!source || !target) return 0;

		if (this.isRightPosition(target, source))
			return source.position.x + this.nodeWidth; // Выход справа
		if (this.isLeftPosition(target, source)) return source.position.x; // Выход слева
		if (this.isCenterRightPosition(target, source))
			return source.position.x; // Выход слева (центральный)
		if (this.isCenterLeftPosition(target, source))
			return source.position.x + this.nodeWidth; // Выход справа (центральный)
		return source.position.x; // По умолчанию
	});

	targetX = computed(() => {
		const source = this.sourceNode();
		const target = this.targetNode();
		if (!source || !target) return 0;
		if (this.isRightPosition(target, source)) return target.position.x; // Вход слева
		if (this.isLeftPosition(target, source))
			return target.position.x + this.nodeWidth; // Вход справа
		if (this.isCenterRightPosition(target, source))
			return target.position.x; // Вход слева
		if (this.isCenterLeftPosition(target, source))
			return target.position.x + this.nodeWidth;
		return target.position.x;
	});
	private nodeHeight = 100;
	sourceY = computed(
		() => (this.sourceNode()?.position.y ?? 0) + this.nodeHeight / 2,
	);
	targetY = computed(
		() => (this.targetNode()?.position.y ?? 0) + this.nodeHeight / 2,
	);
	private bezierSmooth = 100;

	path: Signal<string> = computed(() => {
		const startX = this.sourceX();
		const startY = this.sourceY();
		const endX = this.targetX();
		const endY = this.targetY();

		const dx = Math.abs(endX - startX);
		const offset = Math.max(dx / 2, this.bezierSmooth);

		let sValue = 0;
		if (this.isRightPosition(this.targetNode(), this.sourceNode())) {
			sValue = startX + this.bezierSmooth;
		} else if (this.isLeftPosition(this.targetNode(), this.sourceNode())) {
			sValue = startX - this.bezierSmooth;
		} else if (
			this.isCenterLeftPosition(this.targetNode(), this.sourceNode())
		) {
			sValue = startX + offset;
		} else if (
			this.isCenterRightPosition(this.targetNode(), this.sourceNode())
		) {
			sValue = startX - offset;
		}
		let centerX =
			this.isCenterRightPosition(this.targetNode(), this.sourceNode()) ||
			this.isCenterLeftPosition(this.targetNode(), this.sourceNode())
				? sValue
				: (startX + endX) / 2;
		let centerY = (startY + endY) / 2;
		let svg = `M ${startX} ${startY} S ${sValue} ${startY} ${centerX} ${centerY} S ${endX} ${endY}, ${endX} ${endY}`;
		return svg;
	});

	private isRightPosition(target: any, source: any) {
		return (
			target &&
			source &&
			target.position.x >= source.position.x + this.nodeWidth
		);
	}

	private isLeftPosition(target: any, source: any) {
		return (
			target &&
			source &&
			target.position.x <= source.position.x - this.nodeWidth
		);
	}

	private isCenterRightPosition(target: any, source: any) {
		return (
			target &&
			source &&
			source.position.x > target.position.x - this.nodeWidth &&
			source.position.x < target.position.x
		);
	}

	private isCenterLeftPosition(target: any, source: any) {
		return (
			target &&
			source &&
			source.position.x > target.position.x &&
			source.position.x < target.position.x + this.nodeWidth
		);
	}
}
