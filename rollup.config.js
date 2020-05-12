import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import banner from 'rollup-plugin-banner';
import { join } from 'path';

const bannerConfig = {
	file: join(__dirname, 'LICENSE.txt'),
};

export default [
	{
		input: 'src/index.js',
		output: {
			file: 'dist/index.cjs.js',
			format: 'cjs',
			exports: 'named',
		},
		plugins: [
			resolve(),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/index.js',
		output: {
			file: 'dist/index.esm.js',
			format: 'esm',
		},
		plugins: [
			resolve(),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/index.js',
		output: {
			file: 'dist/index.esm.min.js',
			format: 'esm',
		},
		plugins: [
			resolve(),
			terser({
				output: {
					comments: false,
				},
				compress: {
					ecma: 2018,
					keep_classnames: true,
					module: true,
				},
			}),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/index.js',
		output: {
			name: 'MiniHandle',
			file: 'dist/browser.js',
			format: 'umd',
			exports: 'named',
			compact: true,
		},
		plugins: [
			resolve(),
			babel({
				exclude: 'node_modules/**',
				presets: [
					'@babel/env',
				],
			}),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/index.js',
		output: {
			name: 'MiniHandle',
			file: 'dist/browser.min.js',
			format: 'umd',
			exports: 'named',
			compact: true,
		},
		plugins: [
			resolve(),
			babel({
				exclude: 'node_modules/**',
				presets: [
					'@babel/env',
				],
			}),
			terser({ output: {
				comments: false,
			} }),
			banner(bannerConfig),
		],
	},

	{
		input: 'src/kit.js',
		output: {
			file: 'dist/kit.cjs.js',
			format: 'cjs',
			exports: 'named',
		},
		plugins: [
			resolve(),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/kit.js',
		output: {
			file: 'dist/kit.esm.js',
			format: 'esm',
		},
		plugins: [
			resolve(),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/kit.js',
		output: {
			file: 'dist/kit.esm.min.js',
			format: 'esm',
		},
		plugins: [
			resolve(),
			terser({
				output: {
					comments: false,
				},
				compress: {
					ecma: 2018,
					keep_classnames: true,
					module: true,
				},
			}),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/kit.js',
		output: {
			name: 'MiniHandle',
			file: 'dist/kit.browser.js',
			format: 'umd',
			exports: 'named',
			compact: true,
		},
		plugins: [
			resolve(),
			babel({
				exclude: 'node_modules/**',
				presets: [
					'@babel/env',
				],
			}),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/kit.js',
		output: {
			name: 'MiniHandle',
			file: 'dist/kit.browser.min.js',
			format: 'umd',
			exports: 'named',
			compact: true,
		},
		plugins: [
			resolve(),
			babel({
				exclude: 'node_modules/**',
				presets: [
					'@babel/env',
				],
			}),
			terser({ output: {
				comments: false,
			} }),
			banner(bannerConfig),
		],
	},



	{
		input: 'src/utils.js',
		output: {
			file: 'util.js',
			format: 'cjs',
			exports: 'named',
		},
		plugins: [
			resolve(),
			banner(bannerConfig),
		],
	},
];
