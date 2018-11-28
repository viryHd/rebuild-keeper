
let baseUrl = "http://172.20.17.11:8989/"
module.exports = {
    devServer: {
        // 设置主机地址
        // host: 'localhost',
        // 设置默认端口
        port: 8090,
        https: true,
        // 设置代理
        proxy: {
            // 1.手机号登录
            "/h5/user/mobile": {
                // 目标 API 地址
                target: baseUrl,
                // 如果要代理 websockets
                ws: true,
                // 将主机标头的原点更改为目标URL
                changeOrigin: true,
                pathRequireRewrite: {
                    "^/h5/user/mobile": "/"
                }
            },
            // 2.验证码登录
            "/h5/getCode": {
                target: baseUrl,
                ws: true,
                changeOrigin: true,
                pathRequireRewrite: {
                    "^/h5/getCode": "/"
                }
            },
            "/h5/checkCode": {
                target: baseUrl,
                ws: true,
                changeOrigin: true,
                pathRequireRewrite: {
                    "^/h5/checkCode": "/"
                }
            },
            // 3.头像登录
            "/h5/userLogin": {
                target: baseUrl,
                ws: true,
                changeOrigin: true,
                pathRequireRewrite: {
                    "^/h5/userLogin": "/"
                }
            },
            // 4.用户信息
            "h5/user/getUser": {
                target: baseUrl,
                ws: true,
                changeOrigin: true,
                pathRequireRewrite: {
                    "^/h5/user/getUser": "/"
                }
            },
            // 5.用户信息更新
            "h5/user/h5update": {
                target: baseUrl,
                ws: true,
                changeOrigin: true,
                pathRequireRewrite: {
                    "^/h5/user/h5update": "/"
                }
            },
            // 6.打卡记录
            "h5/user/record": {
                target: baseUrl,
                ws: true,
                changeOrigin: true,
                pathRequireRewrite: {
                    "^/h5/user/record": "/"
                }
            }
        }
    }
}