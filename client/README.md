# about-react-redux-start-kit
a start kit for creat an application with react and redux


## 使用

```bash
$ git clone https://github.com/billyct/about-react-redux-start-kit.git
$ cd about-react-redux-start-kit
$ npm install
$ gulp
```

打开 [http://localhost:3000](http://localhost:3000)

## 关于里面的几个component
* Icon 是一个svg icon的component 跟gulp 的svg 合并的最后路径有点关联
* Clearfix 其实就是 ```<div class="clearfix"></div> //{clear: both}```而已
* Confirm 是一个自定义confirm弹出的插件，具体用法可以看那个demo component
* Modal 其实就是一个包裹confirm这种东西的外面的那种container

这些component都是比较简单的，具体可以看源码，如果你也有比较常用的component 可以pull request我，hah

## 一些东西

* gulpfile是es6的写法的
* webpack.config.js 还是原来node的写法
* 在gulp task 里面监听了 /assets 目录下的fonts和images只是复制到/dist下，而svgs是将里面所有的svg都合成一个，然后放到/dist/icons里面，然后这个目录是跟Icon这个component相关的，地址的改变需要你即改变gulp task里面的路径和在/src/constans/index.js里面的SVG_URL地址
* 关于constans里面的COMMON_STYLE_CLASS变量，是一个css class的前缀，可以根据开发的app的名字来改变
* 如果想开启redux-devtool，那么就去src/index.js里面将一些注释掉的打开，该移动的移动，参考[redux-devtool](https://github.com/gaearon/redux-devtools)的写法
* 关于store，并没有重新定义一个文件，而是直接写在了index.js里面，这样是为了更简明的结构目录
* 关于使用webstorm开发的话，请打开jsx-harmony来使用，还有吧code quality调到eslint
* 关于webpack-dev-server用了react的热插的东西[react-hot-loader](https://github.com/gaearon/react-hot-loader)，这个东西还是超屌的。


## 关于一些规则

* es6的写法，所以当然也可以使用高级的东西，比如async啊promise这些，因为babel-runtime了，当然合并出来的文件肯定会大一些的哈。
* 关于样式的定义最好遵循 [bem](https://css-tricks.com/bem-101/) 对于component来说感觉最合适，然后是scss的
* 关于flux部分，使用了[redux](https://github.com/rackt/redux) 所以我们使用store的时候都使用reducer来做，可以参考其开发文档，其实大概只要明白每次发生action的时候只要不要去直接改变原来的state而是改变它的copy就好
* 关于redux，遵循[ducks-modular-redux](https://github.com/erikras/ducks-modular-redux),个人觉得屌屌的，比起其他的简明很多
* eslint 可以参考.eslintrc 当然其实就是把tab定义为2个，然后请使用'，而不是"来定义字符串什么的

## 之中遇到的小问题

关于npm 无法安装 老是 跳出来 
```npm ERR! phantomjs@1.9.18 install: `node install.js` ```
我也不知道为啥，不过好像可以在前面找到
```
Download already available at /var/folders/9q/b_2yrz1507x0xwvgzp_yxzl00000gn/T/phantomjs/phantomjs-1.9.8-macosx.zip
Extracting zip contents
Error extracting zip
Phantom installation failed Invalid or unsupported zip format. No END header found undefined
```
类似这样的错误，然后只要将比如我这个```/var/folders/9q/b_2yrz1507x0xwvgzp_yxzl00000gn/T/phantomjs/phantomjs-1.9.8-macosx.zip```这个文件rm -rf掉就可以了，好像之前也常常遇到然后没怎么管，今天发现这个可行。如果你也遇到这个问题可以试试。