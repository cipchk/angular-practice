# Host

首先我们需要先理解一个名词：宿主元素（Host Element）。

## 什么是宿主元素？

以**组件或指令**为宿主的元素，比如：

```html
<user-detail log></user-detail>
```

从浏览器角度看，对于指令 `log` 的宿主是 `user-detail` DOM元素，而对于组件 `user-detail` 的宿主就是自身。

## 有什么用？

那么宿主元素到底有什么用呢？假如 `log` 指令是为了实现当点击时增加一次计数，那么在使用该指令是这样：

```html
<div log>click</div>
```

而 `log` 指令内部是如何定义 `click` 事件的呢？

```typescript
@Directive({
    selector: '[log]',
    host: {
        '(click)': 'onClick()'
    }
})
export class Log {
    onClick() { console.log('click'); }
}
```

在装饰器里增加 `host` 对象，而且发现没有，写法就跟绑定语法完全一样，更多写法见[绑定语法](../template/binding-syntax.md)。

这里 `host` 绑定了一个 `click` 事件，那么，我们按绑定语法的其它规则，可以直接在 `host` 加上类名：btn。

```typescript
@Directive({
    selector: '[log]',
    host: {
        '(click)': 'onClick()',
        '[class]': 'cls'
    }
})
export class Log {
    cls: string = 'btn';

    onClick() { console.log('click'); }
}
```

注：`cls` 指的是指令类的属性。

## 语法糖

我不清楚大家有没有发现一个细节，绑定语法的右边是一个字符串、字符串、字符串，假如更改了 `cls` 变量名，然后需要再更改 `host` 中的变量名。

要是不小心忘记了，好累哇，于是……出现了两个语法糖：

+ `@HostListener` 针对事件处理。
+ `@HostBinding` 针对于属性绑定。

同样的 `log` 指令改写成：

```typescript
@Directive({
    selector: '[log]'
})
export class Log {

    @HostBinding('class')
    cls: string = 'btn';

    @HostListener('click', [ '$event' ])
    onClick(event: Event) {
        console.log('click', event);
    }
}
```

爽了！

这里还有一个知识点，是关于样式里也支持 host 概念，而这一点，我统一在[样式](../styles.md)中描述。