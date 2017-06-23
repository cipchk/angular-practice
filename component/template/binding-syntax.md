# 绑定语法

前几节介绍了 {% raw %}`{{}}`{% endraw %}、`*ngFor`、`*ngIf` 它们操作的是如果产生DOM结构。

然而，很多时候需要改变现有DOM的外观或结构；可能是HTML标准的样式，也可能是我们自定义的属性。

而这些属性可能是需要人机去触发，比如：点击事件。也可能是由于数据的变更使某个文字换个颜色。

因此，你是不是感觉到这里有一个非常明确的**数据流向**问题呢？

没错，恭喜你，如果你认知到这一点，那么这一节你算是学会了。

强大的Angular模板引擎提供一种极简单符号来表达这种流向关系。一共就三种，要么从组件类到模板，反之……

| 数据方向 | 语法 | 绑定类型 |
| ------- | --- | ------- |
| 从组件类至模板 | `[target]="expression"` | 自定义属性、DOM属性 |
| 从至组件类模板 | `(target)="statement"` | 事件 |
| 双向 | `[(target)]="property"` | 组件类属性 |


## 一、什么是DOM属性？

上表中事件与组件类属性非常好理解，然而**DOM属性**对于整天泡在HTML世界中的你可能会让你有点懵逼。

先死记一句话：

**Angular模板中绑定的是DOM属性，而不是HTML属性**。

**Angular模板中绑定的是DOM属性，而不是HTML属性**。

**Angular模板中绑定的是DOM属性，而不是HTML属性**。

重要的事要说三百遍。

那么，什么是HTML属性，什么是DOM属性呢？抱歉，最难记明白的事那就不要去明白。当你遇到绑定某个HTML属性，**如果**遇到结果和想的不一样的时候，然后从内心唤起那句话：

**Angular模板中绑定的是DOM属性，而不是HTML属性**。

问题自然就迎刃而解。

## 二、属性绑定 `[]`

### 1、数据流向

从组件到模板。

### 2、语法

```
[target]="expression"
```

这里的 target 包括：DOM属性、指令或组件属性（简称：自定义属性）三种，然后使用 `[]` 中括号包裹。示例：

```html
<!--DOM属性-->
<img [src]="heroImageUrl">
<!--hero-detail组件hero属性-->
<hero-detail [hero]="currentHero"></hero-detail>
<!--ngClass指令属性-->
<div [ngClass]="{special: isSpecial}"></div>
```

而等号的右边表达式**只应该**是一个组件类的 `public` 属性。

### 3、`[]` 作用

`[]` 是明确告诉 Angular 这是一个需计算的表达式，如果不加，那么就是一个普通的**字符串常量**而已。

所以，如果明确目标属性所需要的值是**无须计算**的，那么不加 `[]` 是一个非常好的选择，这样还可以减少 Angular 的变更检测。

{% raw %}
 ```html
<img [src]="heroImageUrl">
<img src="{{heroImageUrl}}">
``` 
{% endraw %}

第2行代码中，别忘记加上插值表达式化符 {% raw %}`{{}}`{% endraw %}。废话，这是理所当然了，不然模板引擎怎么会知道这是一个组件类属性里的值，对吧！

### 4、CSS类绑定

按前面讲的，可以直接使用DOM属性 `class` 直接绑定。

```typescript
cls: string = 'btn btn-default';
```

```html
<div [class]="cls"></div>
```

`[class]` 会替换成 `class` DOM属性值。虽然很爽，但有时候只希望变更某个类名呢，比如当结果为 `true` 时显示为 `btn-success` 样式。

```html
<div [class]="cls" [class.btn-success]="result"></div>
```

当然人类肯定不满足于此，比如希望在不可能用的时候为 `btn-danger` 否则为 `btn-success` 时怎么办？很容易联想到：

```html
<div [class]="cls" [class.btn-success]="result" [class.btn-danger]="!result"></div>
```

WOC，那么长，看起来好恶心呀……

**ngClass**

于是就用了 `ngClass`。

```html
<div [ngClass]="{
    'btn': true,
    'btn-success': result,
    'btn-danger': !result
}"></div>
```

多么唯美的代码呀……

### 5、样式绑定

同 CSS类绑定 完全一样，只不过是将 `class` 换成 `style`，不在赘述。

### 6、无DOM属性的HTML属性绑定

**为什么需要HTML属性绑定**

因为有些HTML属性与DOM属性并无一一对应，比如table的`colspan` HTML属性，是没有一个相应对的DOM属性与之相应对。

如果你需要这类属性的绑定，那么就需要使用： `[attr.colspan]="2"` 。

## 三、事件绑定 `()`

### 1、数据流向

从模板到组件。

### 2、语法

```
(target)="statement"
```

这里的 target 包括：DOM事件属性、指令或组件属性（简称：自定义属性）三种，然后使用 `()` 中括号包裹。示例：

```html
<!--DOM click事件-->
<button (click)="onSave()">Save</button>
<!--组件的save自定义事件-->
<hero-detail (save)="onSave()"></hero-detail>
```

### 3、Event事件处理

对事件处理这是正常不过了，需要在模板中设置 `$event` 参数。

```html
<button (click)="onSave($event)">Save</button>
```

```typescript
onSave($event: any) { }
```

`$event` 指向的是DOM事件对象，因此，可以访问到 `$event.target` 等原生Event事件相关属性。

### 4、组件自定义事件

此节为语法类，更多细节见 [`组件类`](../class/README.md)。

## 四、双向绑定 `[()]`

正如其语法一样 `[()]`，将 `[]`、`()` 组合就是双向绑定了。多么聪明的设定呀，那么，我还能说什么呢？

此节为语法类，更多细节见[forms](../../forms/README.md)。