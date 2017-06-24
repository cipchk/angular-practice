# 属性型指令

会改变 DOM 元素的外观或行为称为属性型指令。

继前面几章节经常出现的 `log` 指令，在此增加一个功能来形象的表述它是属性型指令，当我点击 `log` 指令时更改宿主元素的背景颜色。

还记得前面说了一句：

**决定视图的是数据（组件类的属性或方法）**

然而，对于指令而言这一句并没有用呀，因为指令没办法设置模板 `template: ''`，故而也谈不上所谓的决定视图的就是数据了。

因此，需要有一种能够操作DOM的办法。

## ElementRef & Renderer

Angular提供了两个辅助类：

+ `ElementRef` 访问宿主DOM元素。
+ `Renderer2` 渲染器，用于操作DOM（Style、Class、创建DOM元素等之类）。

```typescript
@Directive({ selector: '[log]' })
export class Log {

    constructor(private el: ElementRef, private render: Renderer2) {
    }

    @HostListener('click')
    onClick() {
        this.render.setElementStyle(this.el.nativeElement, 'background-color', '#f50');
    }
}
```

有关更多 `Renderer2` 渲染器操作请自行实践。

**奇怪的2**

不必太在意，其实还有一个 `Renderer`，但已经标记为过时。