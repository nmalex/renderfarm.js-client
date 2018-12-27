//import resolve from 'rollup-plugin-node-resolve';
//import commonjs from 'rollup-plugin-commonjs';

// import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'dist/index.js',
		output: {
			name: 'RFJS',
			file: "./dist/renderfarm.js",
			format: 'umd'
		},
		plugins: [
			//resolve(), // so Rollup can find `ms`
			//commonjs() // so Rollup can convert `ms` to an ES module
		]
	}
];
