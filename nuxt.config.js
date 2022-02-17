export default {
    // vue: {
    //     configureWebpack: {
    //         module: {
    //             rules: [
    //                 {
    //                     // Exclude `js` files to keep "css" loader working as it injects
    //                     // its runtime that would otherwise be processed through "file" loader.
    //                     // Also exclude `html` and `json` extensions so they get processed
    //                     // by webpacks internal loaders.
    //                     // exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
    //                     // type: 'asset/resource',
    //                     test: /\.glb$/,
    //                     loader: 'url-loader'
    //                 }
    //             ]
    //         }
    //     }
    // },
    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',
    router: {
        base: '/'
    },
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'nuxt-project',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        'element-ui/lib/theme-chalk/index.css'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '@/plugins/element-ui'
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
    // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build'
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
    // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios'
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {},

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: [/^element-ui/],
        standalone: true,
        extend(config, ctx) {
            // 添加可编译的glb和glbf文件类型
            const assetsLoader = config.module.rules.find(rule => {

                return rule.test.test('.png');
            });
            assetsLoader.test = /\.(png|jpe?g|gif|svg|webp|avif|glb|gltf)$/i 
      
            return config;
          }
    }
}
