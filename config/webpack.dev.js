const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
	mode: 'development',
	stats: 'errors-only',

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.[contenthash:8].js'
	},

	devServer: {
		port: 3000 || 3001 || 3002 || 3003,
		hot: true,
		compress: true,
		liveReload: true,
		client: {
			reconnect: true,
			logging: 'error',
		},
	},

	optimization: {
		nodeEnv: 'development'
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname + '/../public/index.html'),
		}),
	],
});