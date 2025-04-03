import { NodeColumn } from './node-column.interface';
import { Guid } from 'guid-typescript';

export interface NodeItem {
	id: Guid;
	name: string;
	position: { x: number; y: number };
	columns: NodeColumn[];
}
