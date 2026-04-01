const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");


const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

const copyAssets = () => {
	const outDir = path.join(__dirname, "dist");
	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir, { recursive: true });
	}

	// Copy Styles
	fs.copyFileSync(
		path.join(__dirname, "src", "webview", "ui", "styles.css"),
		path.join(outDir, "styles.css")
	);

	// Copy Codicons
	const codiconsDir = path.join(__dirname, "node_modules", "@vscode", "codicons", "dist");
	fs.copyFileSync(
		path.join(codiconsDir, "codicon.css"),
		path.join(outDir, "codicon.css")
	);
	fs.copyFileSync(
		path.join(codiconsDir, "codicon.ttf"),
		path.join(outDir, "codicon.ttf")
	);
	
	console.log("✅ Assets copied to dist/");
};

async function main() {
	// Build for Extension
	const extensionCtx = await esbuild.context({
		entryPoints: [
			'src/extension.ts'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'dist/extension.js',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [
			esbuildProblemMatcherPlugin,
		],
	});

	// Build for Webview UI
	const webviewCtx = await esbuild.context({
		entryPoints: [
			'src/webview/ui/main.ts'
		],
		bundle: true,
		format: 'esm',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'browser',
		outfile: 'dist/webview-ui.js',
		logLevel: 'silent',
		plugins: [
			esbuildProblemMatcherPlugin,
		],
	});

	if (watch) {
		await extensionCtx.watch();
		await webviewCtx.watch();
	} else {
		await extensionCtx.rebuild();
		await extensionCtx.dispose();
		await webviewCtx.rebuild();
		await webviewCtx.dispose();
	}

	// Copy assets after build
	copyAssets();
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
