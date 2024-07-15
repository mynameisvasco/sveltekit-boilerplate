import { applyAction } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
import { type ClassValue, clsx } from 'clsx';
import { toast } from 'svelte-sonner';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const formHandler: SubmitFunction = ({ formElement, submitter }) => {
	const icon = formElement.querySelector('button > svg');
	const loadingIcon = document.createElement('span');
	loadingIcon.innerHTML = loadingIconSvg;

	if (icon) {
		icon.remove();
	}

	submitter?.setAttribute('disabled', 'true');
	submitter?.insertAdjacentElement('afterbegin', loadingIcon);

	return ({ result, update }) => {
		update({ reset: false, invalidateAll: true });
		applyAction(result);

		submitter?.removeAttribute('disabled');
		loadingIcon.remove();

		if (icon) {
			submitter?.insertAdjacentElement('afterbegin', icon);
		}

		if (result.type === 'success') {
			if (result.data?.message) {
				toast.success(result.data.message);
			}
		} else if (result.type === 'error') {
			if (result.error?.errorMessage) {
				toast.error(result.error?.errorMessage);
			}
		} else if (result.type === 'failure') {
			if (result.data?.errorMessage) {
				toast.error(result.data?.errorMessage);
			}
		}
	};
};

export const getBreadcrumb = (path: string, custom?: string) => {
	const tokens = path.split('/').filter((t) => t !== '');
	let tokenPath = '';

	const crumbs = tokens.map((t, i) => {
		tokenPath += '/' + t;
		t = t.charAt(0).toUpperCase() + t.slice(1);

		return { label: i === tokens.length - 1 && custom ? custom : t, href: tokenPath };
	});

	return crumbs;
};

const loadingIconSvg = `<svg class="size-3 mr-2 animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
    width="24" height="24">
    <path
      d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
      stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path
      d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
      stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900">
    </path>
  </svg>`;
