import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Guid } from 'guid-typescript';
import { CommonStore } from '../ngrx/common.store';
import {
	CdkDrag,
	CdkDragEnd,
	CdkDragHandle,
	CdkDragMove,
} from '@angular/cdk/drag-drop';
import { NodeItem } from '../model/node-item.interface';
import { ConnectionLineComponent } from './connection-line/connection-line.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CdkDragHandle, CdkDrag, ConnectionLineComponent],
	providers: [],
	templateUrl: './app.component.html',
	styleUrls: [
		'./app.component.scss',
		'../styles.scss',
		'../../node_modules/primeflex/primeflex.scss',
		'../theme/theme.css',
	],
	encapsulation: ViewEncapsulation.ShadowDom,
})
export class AppComponent implements OnInit {
	commonStore = inject(CommonStore);

	ngOnInit(): void {
		let obj1 = Guid.create();
		let obj2 = Guid.create();
		this.commonStore.setNodes([
			{
				id: obj1,
				name: 'Объект 1',
				position: { x: 500, y: 400 },
				columns: [],
			},
			{
				id: obj2,
				name: 'Объект 2',
				position: { x: 1100, y: 200 },
				columns: [],
			},
		]);
		this.commonStore.setEdges([
			{ id: Guid.create(), sourceId: obj1, targetId: obj2 },
		]);
	}

	cdkDragAction(node: NodeItem, $event: CdkDragEnd | CdkDragMove) {
		let rect = $event.source.element.nativeElement.getBoundingClientRect();
		let newPosition = {
			x: rect.left,
			y: rect.top,
		};
		this.commonStore.updateNodePosition(node.id, newPosition);
	}
}
