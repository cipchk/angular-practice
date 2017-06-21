# `{{}}` 插值表达式

插值表达式指是利用 `{{ }}` 包裹着组件类属性名，且支持JavaScript运算。

哎，其实压根就不应该有种这概念，因为你想呀，把组件类的属性放在模板的某个位置，总归需要一定的语法表述，这是理所当然的事情。

好了，我们不管概念问题了。

## 表达式

插值表达式支持JavaScript运算，这也是理所当然的，组件类提供的属性是一个 `boolean` 的话，为了体验我们总归需要转换成笑或哭吧。

```html
{{ love ? '^_^' : '~_~' }}
```

可是，这种方式也会有极限，比如交易状态码与状态中文的转换，状态码可能多达五六种，让你再写三目运算符会奔溃了吧。

所以，就是有一个叫**Pipe**管道的东西，当然现在我不讲，见[Pipe管道](component/pipe.md)章节。

### 受限

正如所有模板引擎一样，表达式总有一些受限，但不多：

+ `=`、`+=`、`-=` 赋值运算
+ `new` 实例运算
+ `++`、`--` 自增减运算
+ `;`、`,` 链接表达式

当然，还有一些Angular占用模板表达式运算符。

+ `|` [Pipe管道](../pipe.md)
+ `?.` 空值判断

### 空值判断

Angular模板引擎的特点，可能被C#6.0荼毒了；但很爽……

```html
<p>我的名：{{ user?.name }}</p>
```

相当于

```html
<p *ngIf="user">我的名：{{ user.name }}</p>
```

而且这种空值判断还可以链式喔。

```html
{{ user?.point?.freeze }}
```

## 输出HTML

很多时候为了美化可能希望输出一段HTML代码，比如：

```html
{{ love ? '<strong>^_^</strong>' : '~_~' }}
```

可是并不我们所想的一样，直接输出一个加粗的 ^_^，这是因为 Angular 从安全的角度，会对数据绑定的输出代码进行无害化处理，就是对一些可能会引起XSS进行编码化。

因此，对于输出HTML需要利用一个 `innerHTML` 指令（是不是觉得这个名称好熟悉，没错，它就是HTML DOM的 **innerHTML** 属性，你会发现Angular就应该是一种单纯的思维去编码，你会发现原来很爽），而 **innerHTML** 对于现流行浏览器有一定的保护作用，当然这是另一个话题了。

```html
<div [innerHTML]="love ? '<strong>^_^</strong>' : '~_~'"></div>
```

> 此时，这里少了 `{{ }}` 这是[模板语法](template.md)的事情，现在你暂时先不管这个问题。

## 输出{{}}

既然 `{{}}` 是插值表达式语法一部分，那有时就是需要输出 {{}} 文本怎么办？因为这一点在显示富文本的内容时经常遇到。

**方法一：使用Unicode编码**

```
{{ hi }}
&#123;&#123; hi &#125;&#125;
```

**方法二：`DomSanitizer`**

```typescript
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  template: `<p [innerHTML]="html"></p>`
})
export class AppComponent {
  html: SafeHtml;
  constructor(sanitized: DomSanitizer) { 
    this.html = sanitized.bypassSecurityTrustHtml(`{{ hi }}`);
  }
}
```

## 约定指南

**简单**

模板的渲染必须要快，因此，**不要**在表达式中存在计算语句。

**幂等性**

**不要**在模板表达式里存在会影响组件类数据的操作。（其实也挺难的，原因见*受限*）