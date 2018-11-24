module.exports = {
    devServer: {
        // 设置主机地址
        host: 'localhost',
        // 设置默认端口
        port: 8090,
        // 设置代理
        proxy: {
            "/h5/user/mobile": {
                // 目标 API 地址
                target: "http://172.20.17.11:8989/",
                // 如果要代理 websockets
                ws: true,
                // 将主机标头的原点更改为目标URL
                changeOrigin: true,
                pathRequireRewrite: {
                    "^/h5/user/mobile": "/"
                }
            },
            "/h5/user": {
                target: "http://172.20.17.11:8989/",
                ws: true,
                changeOrigin: true,
                pathRequireRewrite: {
                    "^/h5/user": "/"
                }
            }
        }
    }
}