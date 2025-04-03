import {
	patchState,
	signalStoreFeature,
	type,
	withMethods,
} from '@ngrx/signals';
import {
	SelectEntityId,
	setAllEntities,
	updateEntity,
	withEntities,
} from '@ngrx/signals/entities';
import { NodeItem } from '../model/node-item.interface';
import { Guid } from 'guid-typescript';

const selectId: SelectEntityId<NodeItem> = (item) => item.id.toString();

export function withNodes() {
	return signalStoreFeature(
		withEntities({
			entity: type<NodeItem>(),
			collection: 'nodes',
		}),
		withMethods((store) => ({
			setNodes(nodes: NodeItem[]) {
				patchState(
					store,
					setAllEntities(nodes, { collection: 'nodes', selectId }),
				);
			},

			getNodeById(id: Guid) {
				return store.nodesEntities().find((node) => node.id === id);
			},

			updateNodePosition(
				id: Guid,
				position: { x: number; y: number },
			): void {
				patchState(
					store,
					updateEntity(
						{
							id: id.toString(),
							changes: () => ({ position: { ...position } }),
						},
						{ collection: 'nodes', selectId },
					),
				);
			},
		})),
	);
}
