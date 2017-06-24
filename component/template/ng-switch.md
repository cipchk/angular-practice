# *ngSwitch

[*ngIf](ng-if.md) 做多值判断时会很难阅读，这个时候 `*ngSwitch` 就有意义了，在使用上也没有太多差异。

比如根据物流类型调用不到物流组件：

```html
<ng-container [ngSwitch]="type">
    <logistic-online *ngSwitchCase="1"></logistic-online>
    <logistic-offline *ngSwitchCase="2"></logistic-offline>
    <p *ngSwitchDefault>物流必选</p>
</ng-container>
```

+ `*ngSwitchCase` 等同于JavaScript中 `case: `。
+ `*ngSwitchDefault` 等同于JavaScript中 `default: `。

**ng-container**

任何指令是需要放置在某个宿主容器，而像 `ngSwitch` 本身只是希望有个容器在寄托；并不希望生成一个可视的DOM元素在DOM树中，这很容易很被样式污染。

其实 `ng-template` 也是这么一个意思。

不要想得太复杂了。