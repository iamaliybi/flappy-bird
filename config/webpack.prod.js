const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',

	output: {
		path: path.resolve(__dirname + '/../build'),
		filename: '[name].bundle.[contenthash:8].js',
		assetModuleFilename: '[path][name].[hash][ext][query]'
	},

	optimization: {
		nodeEnv: 'production',
		minimize: true,
		removeEmptyChunks: true,
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname + '/../public/index.html'),
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "public/assets", to: "assets" },
			],
		})
	],
});