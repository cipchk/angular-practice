# 结构型指令

会改变 DOM 结构的指令称结构型指令。

内置的为数不多，像 [*ngFor](template/ng-for.md)、[*ngIf](template/ng-if.md)、[*ngSwitch](template/ng-switch.md) 前面已经非常详细的介绍了。

## `*` 星号语法糖

所有结构型指令都允许使用星号加指令名称来表示，正如我在 [*ngFor](template/ng-for.md) 解析语法糖中一样。

{% raw %}
 ```html
<ul>
    <li *ngFor="let name of users | async">{{name}}</li>
</ul>
``` 
{% endraw %}

将它拆开来，就是这样子：

{% raw %}
 ```html
<ul>
    <ng-template ngFor let-name [ngForOf]="users | async">
        <li>{{name}}</li>
    </ng-template>
</ul>
``` 
{% endraw %}

那么如何创建一个结构型指令呢？

## 创建结构型指令

假定创建一个 `delay` 延迟结构型指令，允许设置多少时间后才开始构建内容。

从使用者的角度，大概是这样：

```html
<div *ngFor="let item of users | async; let i = index">
    <user-detail [user-id]="item.id" *delay="1000 * i"></user-detail>
</div>
```

迭代的用户列表中会根据下标时间（单位：秒）逐一显示用户信息。

以下是一个结构型指令必备的基本结构体。

```typescript
@Directive({ selector: '[delay]' })
export class Delay {
    constructor(private templateRef: TemplateRef<any>, 
                private viewContainerRef: ViewContainerRef) {}

    @Input()
    set delay(time: number) { }
}
```

构造函数和[属性型指令](attribute.md)构造函数不同的是，这里注入了另外两个辅助类 `TemplateRef`、`ViewContainerRef`，它们代表模板之间的引用对象。

是不是很难理解，OK，现在我先将上面使用者的角度将其拆解一下，你就明白了。

```html
<ng-template [delay]="1000 * i">
    <user-detail [user-id]="item.id"></user-detail>
</ng-template>
```

`ng-template` 对应的就是 `ViewContainerRef`，里头对应的就是 `TemplateRef`。

如果此时还无法豁然开朗那我也没办法，多读几遍，再看接下来的内容吧。

为了达到延迟构建内容，需要增加一个 `setTimeout`，并在方法体内构造模板引用对象的内容。

```typescript
@Input()
set delay(time: number) {
    setTimeout(() => {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
    }, time);
}
```

`createEmbeddedView` 就是用来构建模板下的内容，相当于动态创建 `user-detail` 组件。

OK，到此，我不想再深入了，不然就不是入门与实践了。

## 模板容器

> Angular没有模板容器的概念，是我自己称呼的。

前面我们构建了一个结构型指令 `delay`，并且也分别使用星号语法糖与 `ng-tempalte` 不同的写法去调用该指令。

那么，你是不是有些疑惑？

### 为什么需要 ng-container & ng-template？

容器的作用不言而喻，是为了内容能在正确的位置上呈现。

在为什么要用Angular我说过一句话：**只用一个框架**就可以构建Web应用、移动原生开发、桌面开发。

那么，相同的代码你想要在不同终端上使用的话，Angular就必须适当的抽象化。

从浏览器的角度看，`ng-template` 就是一个Comment元素，因为它在页面中是看不见任何东西，但又能体现容器所需要的作用，何乐不为。

如果在移动原生开发上，`ng-template` 可能就会被渲染成另一个了，这取决于 `Renderer` 渲染器了。