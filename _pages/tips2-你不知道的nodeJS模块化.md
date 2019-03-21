# node如何引入模块

首先你已经安装了node。尝试新建两个文件，如下

```javascript
index.js
test.js
```
当我想在index文件里面引入一个系统自带的模块"net"，我们需要成这个样子
```javascript 
var net = require（"net"）
net.function...
```
当我们想在index文件里面引入一个自己创建的test.js文件的时候，我们尝试按照上面的写法引入
```javascript
var test = require（"test.js"）
test.function...
```
结果发现报错了。

原因是我们如果要引用自己创建的文件的话，必须加上./
例如：
```javascript
var test = require（"./test.js"）
test.function...
```
这样子就不会报错了

# module.exports和exports的区别
node的模块化有三个关键词；第一个是require、第二个是module，第三个是exports

看下面的代码

// test.js
```javascript
var a = 123
var b = "abc"

module.exports.a = a
```
// index.js
```javascript
var test = require("./test.js")
console.log(test)
```
这时候会输出```{ a: 123 }```

简单说一下，module.exports是一个对象，通过这个对象，把对象上面的东西暴露给require的变量

其实module.exports有一个简写。将上面的test文件改一下：
// test.js
```javascript
var a = 123
var b = "abc"
exports.a = a
```
输出的结果还是```{ a: 123 }```

这是为什么呢？这里涉及到我们很久以前学过的知识：引用值

一开始的时候，exports和module.exports都是指向一个空对象，即{}。

突然有天exports.a 指向了 a，而module.exports.a = b
而最后导出的只会是module.exports。（实际上不管是先执行module.exports还是exports，导出的永远是module.exports，这个点很少人知道，下文有说）

## 如何验证我们的猜测是正确的？
判断exports与module.exports是否相等，只需要console一下即可，原因是引用值的判断方式是根据地址判断，除非地址完全一致，否则返回的都不可能是true

console.log(exports == module.exports) // 结果为true 说明这俩哥们是完全一样的

## 为什么require、module、exports我们可以直接使用？

尝试写上以下代码

```javascript
console.log(require)
console.log(module)
console.log(exports)
console.log(__dirname)
console.log(__filname)
```
你会惊奇的发现居然没有报错！为什么我们可以直接使用这几个变量？？？莫非他们就是传说中的系统变量吗？答案是：不是。

其实我们的node.js是运行在一个函数里面的

这个函数大概长这个样子：

```javascript
function funName(module, require, exports, __dirname, __filname){
   // 中间的内容就是我们写的nodeJS代码
    
    return module.exports;
}
```
而我们写的代码，都会通过参数传到这个函数里面执行。而这个return module.exports 就是导致我们不管是先执行module.exports还是exports，导出的永远是module.exports的元凶！

## 下面我们来验证一下是不是真的有这个函数

在js里面写上一个console.log(arguments)

你会惊奇的发现输出了下面这个东西：

```javasccript
{ '0': {}, // exports
  '1':  { [Function: require] // require
         resolve: { [Function: resolve] paths: [Function: paths] },
         main: 
          Module {
            id: '.',
            exports: {},
            parent: null,
            filename: 'E:\\Workers\\nodeDemo\\blog\\index.js',
            loaded: false,
            children: [],
            paths: [Array] },
         extensions: { '.js': [Function], '.json': [Function], '.node': [Function] },
         cache: { 'E:\\Workers\\nodeDemo\\blog\\index.js': [Object] } 
         },
  '2':  Module { // module
         id: '.',
         exports: {},
         parent: null,
         filename: 'E:\\Workers\\nodeDemo\\blog\\index.js',
         loaded: false,
         children: [],
         paths:   [ 'E:\\Workers\\nodeDemo\\blog\\node_modules',
                    'E:\\Workers\\nodeDemo\\node_modules',
                    'E:\\Workers\\node_modules',
                    'E:\\node_modules' 
                  ] 
        },
    '3': 'E:\\Workers\\nodeDemo\\blog\\index.js', // 文件名filname
    '4': 'E:\\Workers\\nodeDemo\\blog'  // 路径名dirname
  }
  ```
  
由此可见，
  第一个参数就是exports，第二个是require，然后是 module filname dirname

如果你还不相信，你可以这样，在js里面验证一下

```javascript
console.log(arguments[0] == exports)
console.log(arguments[1] == require)
console.log(arguments[2] == module)
console.log(arguments[3] == __filename)
console.log(arguments[4] == __dirname)
```
结果全部是true！！！
  
到了这里，你大概就能理解为什么exports和module.exports都能导出东西了：当你尝试以下代码的时候

```javascript
var a = 123
var b = "aaa"
exports = a
module.exports = b
```
这时候在console.log(arguments)一下，你会发现：
```javasccript
{ '0': 123, // exports
  ...
  '2':  Module { // module
         id: '.',
         exports: aaa,
   ...
  }
 ```
  exports和module.exports的值都改变了
  
  
  
  
  
  
  
  
  
  
  
  
  
