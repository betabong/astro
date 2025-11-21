import { defineComponent, h } from 'vue';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * This is the Vue + JSX equivalent of using `<div v-html="value" />`
 */
const StaticHtml = defineComponent({
	props: {
		value: String,
		name: String,
		hydrate: {
			type: Boolean,
			default: true,
		},
	},
	setup({ name, value, hydrate }) {
		if (!value) return () => null;
		let tagName = hydrate ? 'astro-slot' : 'astro-static-slot';

		// Detect if we're in a browser (client-side hydration)
		const isBrowser = typeof document !== 'undefined';

		if (isBrowser && hydrate) {
			// During client-side hydration, don't set innerHTML
			// This allows Vue to adopt existing server-rendered DOM nodes
			// without replacing them, preserving event listeners and modifications
			return () => h(tagName, {
				name,
				// Suppress hydration mismatch warnings
				'data-astro-preserve': ''
			});
		}

		// Server-side or non-hydrating: use innerHTML as before
		return () => h(tagName, { name, innerHTML: value });
	},
});

/**
 * Other frameworks have `shouldComponentUpdate` in order to signal
 * that this subtree is entirely static and will not be updated
 *
 * Fortunately, Vue is smart enough to figure that out without any
 * help from us, so this just works out of the box!
 */

export default StaticHtml;
