# *ngIf

很多时候需要部分显示的情况下，比如当 `user.id===1` 的时候才显示【管理员】字样，就可能需要使用另一个语法糖 `*ngIf`。

{% raw %}
 ```html
<ul>
  <li *ngFor="let item of users; let i = index;">
    {{i + 1}}: {{item.name}}
    <strong *ngIf="item.id === 1">管理员</strong>
  </li>
</ul>
``` 
{% endraw %}

## 性能

`*ngIf` 内所有组件、指令都不需要被创建和变化检测，这是一个非常重要的可优化的信息点。

## *ngFor & *ngIf

无意中总是会写了这样的代码：

{% raw %}
 ```html
<li *ngIf="showUsers" *ngFor="let item of users">{{item.name}}</li>
``` 
{% endraw %}

然后收到一个懵逼的异常：

```
Error: (SystemJS) Error: Template parse errors:
	Can't have multiple template bindings on one element. Use only one attribute named 'template' or prefixed with * ("
```

这是因为Angular不支持在一个元素里有多个结构指令，我会在[结构指令](../structural.md)详细说明。为了完整度，这里只简单给出答案。

{% raw %}
 ```html
<ng-container *ngIf="showUsers">
  <li *ngFor="let item of users">{{item.name}}</li>
</ng-container>
``` 
{% endraw %}

## 解析语法糖

```html
<strong *ngIf="item.id === 1">管理员</strong>
```

将它拆开来，就是这样子：

```html
<ng-template [ngIf]="item.id === 1">
  <strong>管理员</strong>
</ng-template>
```
