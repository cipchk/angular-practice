# 样式

组件样式提供 `styles` 或 `styleUrls` 两种样式写法。而 `styleUrls` 这里的URL接收不光可以是一个 `css` 文件，还允许接收时下所有浏览CSS预处理（例：scss、less等）的文件格式，当然这并不是Angular的功能，而是Webpack的特性。

## 一个简单示例

```typescript
@Component({
    template: `<p>asdf</p>`,
    styles: [ `p { font-size: 18px; }` ]
})
```

最终看到：

```html
<style>
p[_ngcontent-c0] {
    font-size: 18px;
}
</style>
<p _ngcontent-c0="">asdf</p>
```

为什么会_ngcontent-c0，下面我以 Web Components 标准的角度看待 Angular 在样式上面是如何兼容这种标准，这能理解为什么会这样、为什么需要这样。

## Web Components

我前面几章节一直提到 Web Components 标准，同时Angular组件也兼容这种标准。Web Components 的每一个组件都是由组件自己来组织JS、CSS、DOM的。

换成Angular角度的话，我用一个比较通俗的讲：组件的使用者无须关心组件长什么样，这一切由组件内部自己完成，且不会污染其它组件（包括：父组件或子组件）。

这也就是为什么明明样式 `p` 最终会变成 `p[_ngcontent-c0]`，本质上就是为了兼容 Web Components 概念。

### Shadow DOM

Web Components 有一个非常重要的概念叫：Shadow DOM。它能在DOM树中完全独立于其它DOM元素的结构，这样对我们组件而言更加的独立性。

关于这一点，你只需要打开这个[html5](http://www.w3school.com.cn/tiy/loadtext.asp?f=html5_video)页面，然后 devtools -> elements 面板中看到，原来页面只是使用 `<video src="/i/movie.ogg" controls="controls"></video>` 简单的调用，而呈现是一个功能完整又丰富的视频播放器。

这就是 Web Components 魅力所在。

我一直在说 Angular 兼职这种标准，而且非常简单，只需要加一个 `encapsulation` 配置项。

```typescript
@Component({
    template: `<p>asdf</p>`,
    styles: [ `p { font-size: 18px; }` ],
    encapsulation: ViewEncapsulation.Native
})
```

同样在 Elements 面板里看到的会是这样：

```html
#shadow-root
    <style>p { font-size: 18px; }</style>
    <p>asdf</p>
```

虽然 `p` 定义的是一个全局性质，但它只对 #shadow-root 节点下面的 `<p>` 有效。

**样式选择器**

样式选择器这在CSS中最核心，Shadow DOM 提供了一组便于操作样式选择器的写法，比如：`:host` 来表示DOM自身。

这一些已经不是Angular的范围，有关更多细节，可以自行百度：Shadow DOM。

## `encapsulation`

上面我们说到 `encapsulation`，它是指组件的样式、模板是采用哪种封装策略。

**Emulated**

隔离模式。即组件模板与样式不会影响其他组件。且对于样式而言，不会影响父组件和子组件的样式。

组件的默认策略。

**Native**

Shadow DOM 模式，即组件模板与样式不会向上影响。但对于样式而言，如果你采用 `:host` 选择器写法，那么会影响子组件。

**None**

对于样式而言，是全局性质的。