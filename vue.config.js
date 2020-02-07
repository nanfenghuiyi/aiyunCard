// const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  // baseUrl从 Vue CLI 3.3 起已弃用，请使用publicPath
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。
  // 如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
  publicPath: "./",
  //   process.env.NODE_ENV === "production" ? "/production-sub-path/" : "/",
  // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。
  // 注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
  // 默认值'dist'
  // outputDir: "dist",
  outputDir: process.env.outputDir,
  // 放置生成的静态资源 (js、css、img、fonts) 的目录(相对于outputDir目录)。
  // 默认值''
  // assetsDir: "assets",
  //指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
  // 默认值'index.html'
  indexPath: "index.html",
  // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。
  filenameHashing: true,
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。这个值会在 @vue/cli-plugin-eslint 被安装之后生效。
  // lintOnSave: process.env.NODE_ENV !== "production",

  //是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
  // runtimeCompiler: false,

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,

  // 移除console
  /* configureWebpack: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          },
        }),
      ]
    }
  }, */
  configureWebpack: config => {
    if (process.env.VUE_APP_CURRENTMODE === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = false
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
    }
  },

  /* chainWebpack(config) {
    config.plugins.delete('preload') // TODO:需要测试
    config.plugins.delete('prefetch') // TODO:需要测试

    config
    .when(process.env.NODE_ENV !== 'test',
      config => {
        config
          .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // 仅打包最初依赖的第三方
              },
              elementUI: {
                name: 'chunk-elementUI', // 将elementUI拆分为一个包
                priority: 20, // 重量必须大于libs和app，否则将打包成libs或app
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // 可以自定义规则
                minChunks: 3, //  最小公共数
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })
        config.optimization.runtimeChunk('single')
      }
    )
  } */
};