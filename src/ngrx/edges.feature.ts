import {
	patchState,
	signalStoreFeature,
	type,
	withMethods,
} from '@ngrx/signals';
import {
	SelectEntityId,
	setAllEntities,
	withEntities,
} from '@ngrx/signals/entities';
import { Guid } from 'guid-typescript';

export interface Edge {
	id: Guid;
	sourceId: Guid;
	targetId: Guid;
}

const selectId: SelectEntityId<Edge> = (item) => item.id.toString();

export function withEdges() {
	return signalStoreFeature(
		withEntities({
			entity: type<Edge>(),
			collection: 'edges',
		}),
		withMethods((store) => ({
			setEdges(edges: Edge[]) {
				patchState(
					store,
					setAllEntities(edges, { collection: 'edges', selectId }),
				);
			},

			// addEdge(sourceId: string, targetId: string) {
			// 	const newEdge: Edge = {
			// 		id: Guid.create().toString(),
			// 		sourceId,
			// 		targetId,
			// 	};
			// 	store.updateEdges((edges) => [...edges, newEdge]);
			// },
			// // Удаление связи
			// removeEdge(edgeId: string) {
			// 	store.updateEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
			// }
		})),
	);
}
