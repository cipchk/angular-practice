# Pipe管道

用于转换显示文本叫Pipe管道，其作用是对数据进一步转换。 

## 为什么需要？

交易状态数量一般会多达五六项，而且数据一般是用字符串或数字在数据库中表示，倘若直接显示这些数据，除了开发人员谁也不知道这是些代表什么。

+ `1` 新订单
+ `2` 待支付
+ `4` 待发货
+ `8` 完成

## 如何创建Pipe？

Pipe 是一个**简单类**，我们只需要实现 `PipeTransform` 以及利用装饰器 `@Pipe` 定义Pipe名称就行了。

```typescript
@Pipe({ name: 'tradeStatus' })
export class StatusPipe implements PipeTransform {
    transform(value: any, cancelReason?: string) {
        switch (value) {
            case 1: return `新订单`;
            case 2: return `待支付`;
            case 4: return `待发货`;
            case 8: return `完成`;
            case 16: return `取消（原因：${cancelReason}）`;
            default: return `无效`;
        }
    }
}
```

接口 `transform` 方法至少需要一个参数 `value` 表示待转换的值，而后面的可选参数允许我们额外提供，用于特定处理，比如这里的取消原因。

## 如何使用？

绝大多数情况下，会在插值表达式中使用，只需要Pipe操作符 `|` 就非常方便调用。

{% raw %}
 ```html
{{item.status | tradeStatus }}
``` 
{% endraw %}

如果是已经取消的，还可以加上取消原因：

{% raw %}
 ```html
{{item.status | tradeStatus: item.cancelReason }}
``` 
{% endraw %}

### 如何在Component或Service中使用Pipe

前面我说它是一个简单类，而对于类的使用就是实例它。

```typescript
console.log(new StatusPipe().transform(1)); // 新订单
```

## 内置Pipe

Angular提供了几个常用的Pipe：

**async**

自动订阅异步，见[*ngFor](template/ng-for.md)。

**DatePipe**

日期格式化提供了非常丰富的[格式化符号](https://angular.io/api/common/DatePipe)，{% raw %}`{{ now | date: 'yyyy-MM-dd' }}`{% endraw %} => `2017-06-24`。

**CurrencyPipe**

货币格式化，{% raw %}`{{ 100 | currency:'CNY' }}`{% endraw %} => `CNY100.00`。

它货币代码遵循的是[ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)标准。然而，其实我只想要一个保留2位小数+千位符而已啦，然后这个货币内置很难满足我的要求：

{% raw %}
 ```html
{{ 1000.555 | currency:'CNY':true:'3.2-2' }}

Result: CN¥1,000.56
``` 
{% endraw %}

**DecimalPipe**

数字格式化，{% raw %}`{{ 10000.566 | number: '3.2-2' }}`{% endraw %} => `10,000.57`。

其实用它来表示货币，感觉更符合本土化，而对于货币也短了一点点。

**slice**

从数组中返回选定的项，比如获取下标1至5的数据 {% raw %}`{{ users | slice:1:5 }}`{% endraw %}。

**json**

JSON字符串化，调试的时候好方便。{% raw %}`{{ user | json }}`{% endraw %}。

**UpperCasePipe**

大写字母化，{% raw %}`{{ 'asdf' | uppercase }}`{% endraw %} => `ASDF`。

**LowerCasePipe**

大写字母化，{% raw %}`{{ 'Asdf' | lowercase }}`{% endraw %} => `asdf`。