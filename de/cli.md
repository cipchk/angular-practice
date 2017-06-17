# Angular Cli

Webpack 能够像Node.js（即CommonJS规范）一样处理依赖关系，然后解析出模块之间的依赖，最后将其代码打包。而Angular本身是由TypeScript开发的，可以直接生成CommonJS规范代码。所以，Angular与Webpack最配。

当然啦，这个配置Webpack…！@#￥%……&*，好烦啊，还没开始写就要写一大堆配置，心累！

于是，Angular Cli 就出现了，它极大的简化构建 Angular 脚手架的命令行工具。

## 安装

```bash
# 经常用的东西当然要全局安装啦
npm install -g @angular/cli
```

## 创建与运行项目

现在构建一个Angular项目，只需要这样：

```bash
# 默认生成的样式是css，我已经习惯 scss，所以……
ng new hi-angular --style scss
```

默认会安装所有需要的依赖包。

**网络问题引起的安装失败**

因为 `npm` 本身是国外的产物，一般情况下都不会有什么问题，但如果你遇到一些带**红色**字样的话，那么绝大多数都是在安装依赖包时无法下载导致的。那么，可以使用 tabao 镜像服务器 [cnpm](https://npm.taobao.org/) 试试，先删除项目下的 **node_modules**，然后执行：

```bash
cnpm install
##########或者安装 [nrm] 也可以快速切换不同的NPM数据源########
# nrm use taobao
# npm install
##### OR #####
# nrm use cnpm
# npm install
```

_以上几乎解决我遇到的网络环境的所有问题，如有其他种情况请告知。_

## 开发环境

运行 `ng serve`，打开浏览器访问：**http://localhost:4200**，看到“Welcome to app!!”字样，恭喜你，欢迎来到Angular世界！

当你修改 `src/app/app.component.html` 内容保存后，会自动刷新浏览器。Happy Coding!!!

### 跨域

**方法一：cors**

最简单的办法是让后端环境支持CORS。

**方法二：webpack**

前后端分离开发最经常遇到便是跨域，而Webpack本身提供一种简单的代理配置，来满足请求域名的问题。

首先，在根目录下创建 `proxy.conf.js`：

```json
const PROXY_CONFIG = [
    {
        context: [
            "/my",
            "/many",
            "/endpoints",
            "/i",
            "/need",
            "/to",
            "/proxy"
        ],
        target: "http://localhost:3000",
        secure: false
    }
]

module.exports = PROXY_CONFIG;
```

其次，启动Angular时变成：

```bash
ng serve --proxy-config proxy.conf.js
```

这样，当Angular内访问 `/my` 时，实际代理请求为：`http://localhost:3000/my`。


```typescript
this.http.get('/my');
// 实际请求：http://localhost:3000/my
```

## 生产环境

而对于生产环境Angular Cli也提供相应的命令编译Angular项目。

```bash
ng build --prod
```

该命令有更多的参数包括。

**--aot**

预编译，提升模板渲染速度。

**--base-href（别名：-bh）**

默认 `index.html` 的 `<base href="/">` 指定参数可以改变这个值。

**--environment（别名：-e）**

定义编译环境。

**--extract-css（别名：-ec）**

将 `src/styles.scss` 的内容编译成 *.css，而不是编译进js文件里。（这是webpacke特性，允许将图像、css、iconfont等编译进js中）

**--sourcemap（别名：-sm）**

是否输出 Sourcemap 文件。

**--output-hashing（别名：-oh）**

设置输出文件名哈希值格式，包括四个值：

+ `none` 无任何哈希。
+ `media` 只对那些标记 **[url|file]-loader** 的文件进行哈希。
+ `bundles` 所有输出文件加上哈希。
+ `all` 相当于 `media` 和 `bundles`。

**--output-path（别名：-op）**

指定输出路径。

以上可能是经常用到的一些参数，而上面你看到的 `--prod` 是一个快捷参数，相当于：

```bash
ng build --aot -e prod -oh all -sm false -ec true
```

至此，只是通过简单的三行命令，从创建Angular项目、进入开发环境最后编译成生成环境。

怎么样？

正如那句广告词 “so easy!”。