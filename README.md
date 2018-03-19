# sdut_gplt_ranklist

山东理工大学团体程序设计天梯赛 - PTA 比赛团队排名榜

[在线 Demo](https://acm.sdut.edu.cn/sdut_gplt/)

------

通过爬取 [PTA](https://pintia.cn/) 比赛的个人积分榜，转换成体验更友好的天梯赛团队积分榜。支持查看队内积分表。

第一个 React 练手页面，使用 [Create React App](https://github.com/facebook/create-react-app) 创建。

### 项目依赖

- [react-bootstrap](https://github.com/react-bootstrap/react-bootstrap/)
- [axios](https://github.com/axios/axios)


### 使用方法

安装依赖：`npm install`

调试运行：`npm start`

打包：`npm run build`

比赛排名数据文件为默认为 `ranklist.json`，可在 `src/config.js` 中自定义。示例数据在 `public` 目录下。

### 致谢

感谢 [@MeiK-h](https://github.com/MeiK-h) 对比赛数据爬虫提供部分技术支持。图片资源由社团同学 @一十 提供。


