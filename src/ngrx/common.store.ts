import { signalStore, withMethods } from '@ngrx/signals';
import { withNodes } from './nodes.feature';
import { withEdges } from './edges.feature';

export const CommonStore = signalStore(
	{ providedIn: 'root' },
	withNodes(),
	withEdges(),
	// withDialog(),
	withMethods((store) => ({})),
);
