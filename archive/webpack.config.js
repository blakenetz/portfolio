const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: ["./src/main.js"],
	devServer: {
		hot: true,
		watchOptions: {
			poll: true
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: "vue-loader"
			},
			{
				test: /\.js$/,
				use: "babel-loader"
			},
			{
				test: /\.s?css$/,
				use: [
					{ loader: "vue-style-loader" },
					{
						loader: "css-loader",
						options: {
							importLoaders: true
						}
					},
					{
						loader: "postcss-loader",
						options: {
							plugins: () => [require("autoprefixer")]
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "index.html",
			inject: true
		}),
		new HtmlWebpackPlugin({
			filename: "error.html",
			template: "error.html",
			inject: true
		}),
		new CopyWebpackPlugin([
			{
				from: "assets/images",
				to: "assets/images",
				toType: "dir"
			}
		])
	]
};
