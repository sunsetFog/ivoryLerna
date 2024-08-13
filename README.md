## 使用monorepo目录结构管理多个功能一致高度品牌化的站点源码


### 目录结构设计要求
- 能够通过`目录结构提升`扩大`组件/模块`的`文件夹/文件`的共享范围
- 能够隔离不同`站点/端`之间`资源/组件/模块`的差异
- 代码对资源的引用路径不需要环境变量参与。IDE在重构（refactor）操作场景，能够跟踪引用路径的变化，增加可维护性。

### 如何解决端与站的差异性代码去向问题？

下面通过一种树形结构，来说明对`组件`进行`目录结构提升`对扩大共享范围的意义
```text
components 跨端共享，要求分离与端有关的差异代码
  components-h5 跨站共享，要求分离与站有关的差异代码
    website1-h5
      components 站内共享，要求分离与页面有关的差异代码
      page1
        components 页面内共享，含有页面专属私有的逻辑代码
      page2
    website2-h5
  components-web
```
这种目录划分方式与 [桥接模式](https://blog.csdn.net/lmb55/article/details/51044078) 对类的划分思想有异曲同工之处，
通过聚合复用规则实现了可扩展性（scalable）的要求。

## Getting Started

先查阅 [git lfs大文件管理](#git-lfs) 文档，安装配置好git lfs

### 安装依赖
```shell
不推荐
yarn
推荐
npm install
```

### 启动某个站点本地开发服务
通过命令行操作
举例启动站点website-h5的开发服务
```shell
cd packages/website-h5
yarn serve:develop
```

## 约定式提交（Conventional Commit）
### 通过命令行工具
```shell
yarn commit
```
命令干了什么：
- 调用commitizen提供向导来生成commit message

### 约定式提交规范

无论通过什么途径，都是协助你生成结构化的git commit message

See also: https://www.conventionalcommits.org/zh-hans/v1.0.0/

### 生成变更日志和版本标签
有了`约定式提交`的前提，那么借助lerna生成change log和打版本tag都方便了许多
```shell
yarn lerna:version
```
命令干了什么：
- 根据上一个版本之后的git logs更新CHANGELOG.md，没有则创建
- 用git tag生成版本标签
- 推送前两项更新到远程仓库

## 编码规范
### 在代码编辑时启用检查


#### stylelint
插件：
- webstorm 已经内置，需自行启用
- vscode https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint

### 在提交时检查
已经通过配置lint-staged，默认在提交时通过自动修复的方式检查代码，无法修复的需要动手整改。

## 构建部署项目相关命令

先查阅 [git lfs大文件管理](#git-lfs) 文档，安装配置好git lfs

### 使用next应用自带的web server
项目构建和web服务都在同一服务器
```shell
# 进入某个站点目录
cd packages/website-h5
# 生产环境构建
yarn build:prod
# 启动自带的web server
yarn start:prod
# 端口可以通过-p参数自定义，不传递默认3000
# yarn start:prod -p 3000
```

项目构建和web服务不在同一服务器
```shell
# 进入某个站点目录
cd packages/website-h5
# 生产环境构建
yarn build:prod
# 运维同事可能希望你只提供他所需的相关文件
yarn pack:next
# 然后会通过rsync同步到远程服务器
rsync dist remote/dist
# 远程服务器上安装next应用相关依赖
yarn
# 直接启动
yarn start:prod
```

### 使用Static HTML Export导出next应用，使用其他web server
例如导出生产环境

进入某个站点目录
```shell
cd packages/website-h5
```
导出
```shell
yarn export:prod
```
本地预览
```shell
yarn serve:export
```
如果使用web server如nginx，需要实现一些rewrite规则
- /demo/post/1 -> /demo/post/1.html
- /api/path/to -> https://api.destination.com/path/to

## git lfs大文件管理 <a name="git-lfs" />
先看看系统内是否正常安装了git lfs客户端
```shell
git lfs version
```
如果以上命令能正常输出版本号，那么恭喜你不需要再操心安装相关的问题。
如果发现没有安装，得去 [downloading git-lfs client](https://github.com/git-lfs/git-lfs#downloading) 看看安装指引。

完成安装后，初始化一下lfs相关配置
```shell
# --skip-smudge选项表示clone/pull时默认不下载大文件，因此后续更新需要手动使用git lfs pull获取文件
# 更多选项 https://github.com/git-lfs/git-lfs/blob/main/docs/man/git-lfs-install.1.ronn#options
# 全局级别设置。可以影响所有初始git clone时的行为
git lfs install --skip-smudge
# 当前项目级别设置。只能在git clone之后进入git项目根目录执行，只影响到后续更新行为
git lfs install --skip-smudge  --local
```

默认情况下，在构建前或启动开发服务前，已经帮你按需获取所需的大文件，你不需要额外操作。
下面依然列举一些常用获取大文件的使用场景
- 只获取某个站点和其依赖包的大文件
  ```shell
  git lfs pull -I "packages/components,packages/ui-h5,packages/website-h5"
  ```
- 获取所有git lfs存储的文件
  ```shell
  git lfs pull
  ```

更多相关文档：
- https://github.com/git-lfs/git-lfs/blob/main/docs/man/git-lfs-fetch.1.ronn
- https://www.atlassian.com/git/tutorials/git-lfs

## 批量更新依赖包版本
monorepo中管理着多个packages，哪天需要批量更新它们的依赖时，可以试试`yarn upgrade-interactive`。
命令输入后会罗列出可以更新的包供你选择，按下空格键表示选择，回车表示确认开始执行。下面对命令做些简短说明。

向后兼容的更新方式，尝试罗列所有包可以更新的版本
```shell
yarn upgrade-interactive --latest --caret
```

只罗列next包可以更新的版本
```shell
yarn upgrade-interactive next --latest --caret
```

指定next包，忽略package.json中版本范围的限制，允许罗列主版本（不兼容）的更新。
假设next当前主版本为11.0.0，你了解到近期next刚发布了12.0.0最新版不久，你想升级到这个版本，
并负责解决因主版本号变更可能带来的兼容问题。
```shell
yarn upgrade-interactive next --latest
```

更多相关文档：
- https://classic.yarnpkg.com/en/docs/cli/upgrade#toc-yarn-upgrade-package-latest-l-caret-tilde-exact-pattern
- https://classic.yarnpkg.com/lang/en/docs/cli/upgrade-interactive/


