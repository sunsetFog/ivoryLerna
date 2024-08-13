/*
yarn下载不了devDependencies依赖？？得用npm下载
npm install --save-dev path
npm install --save-dev @craco/craco

lerna create-react-app项目
packages/energy 共享组件
packages/goose是create-react-app项目，用的是react-scripts
goose想引入共享组件，但问题是共享组件需要以便 Babel 可以转译额外的目录中的文件？？
*/
const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');

const packages = [];
packages.push(path.join(__dirname, '../energy'));

module.exports = {
  webpack: {
    configure: (webpackConfig, arg) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName('babel-loader')
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];

        match.loader.include = include.concat(packages);
      }

      return webpackConfig;
    },
  },
};
