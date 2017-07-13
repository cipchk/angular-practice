# Observable

## 一、什么是Observable

`Observable` 称它为可观察对象，它并不是Angular的东西，而是ES7的一种用来管理异步数据的标准，当然ES7离我们太远了，但借助ts让我们忽略这种标准与现实的差距。

`Observable` 可观察对象是开辟一个连续的通信通道给观察者 `Observer`，彼此之前形成一种关系，而这种关系需要由 `Subscription` 来确立，而在整个通道中允许对数据进行转换我们称为操作符 `Operator`。

将上面的描述转化成代码的话，就像这样：

```typescript
import { Observable } from 'rxjs/Rx';

let sub = Observable
    .interval(1000)
    .map(second => second + '秒')
    .subscribe(res => {
        console.log(res);
    });
```

利用 `Observable.interval` 每隔1秒产生一个数据，然后交给 `map` 操作号将内容进行转换，最后交过观察者打印结果。

注：Observable必须通过 `subscribe` 来订阅（即Observable与Observer确立关系）以后才会启动，并且它会返回一个可用于取消订阅的方法。

```typescript
sub.unsubscribe();
```

而这一整个过程，称为：**流**。

## 二、创建 `Observable`

只需要实例一下 `Observable` 就行了。

```typescript
new Observable<number>((observer: Observer<number>) => {
    // 做任何你想做的事
    setTimeout(() => {
        observer.next(1000);
    }, 1000);
})
```

内容非常简单，你可以在方法体内做任何你想做的事，当有数据需要发送给观察者时，只需要调用观察者的 `next()` 方法。

注：这里 `new Observable<number>` 是一个泛型，无形中有一个极大的好处是：限定数据类型，这也导致整个数据流受到严格的约束。

我们更进一步，比如Angular框架中的 `Http` 网络请求类，大概如下：

```typescript
new Observable<Response>((observer: Observer<Response>) => {
    let _xhr = new XMLHttpRequest();
    _xhr.addEventListener('load', () => {
        if (true) {
            observer.next(response);
            observer.complete();
        } else {
            observer.error(response);
        }
    });
    _xhr.send();
})
```

不管输入终端来自哪里（网络请求、表单录入、定时器等），都可以将它们转化成数据流处理。

**Observable.fromEvent()**

从事件（文本框事件、滚动条事件等）中创建数据流。比如创建一个文本框 `input` 事件。

```typescript
const node = document.querySelector('input[type=text]');
Observable.fromEvent(node, 'input')
  .map((event: any) => event.target.value)
  .filter(value => value.length >= 2)
  .subscribe(value => {
      console.log(value);
  });
```

当用户向文本框录入数据时，会向观察者发送一次数据，且这些数据需要经过转换 `map` 和 过滤 `filter` 后，才会交给观察者。

## 三、操作符

从 `Observable` 产生的数据要交给观察者前，允许对这些数据进行转换，像上面示例中的 `map`、`filter` 都属于这一类。

每一次经过操作符都会**重新产生新的`Observable`**，不管有多少个操作符，最终都只有一个 `Observable` 会被观察者订阅。


## 总结 

RxJS最难我想就是各种operator的应用了，这需要一些经验的积累。RxJS很火很大原因我认还是提供了丰富的API，以下是摘抄：

**创建数据流**

+ 单值：`of`、`empty`、`never`
+ 多值：`from`
+ 定时：`interval`、`timer`
+ 事件：`fromEvent`
+ Promise：`fromPromise`
+ 自定义：`create`

**转换**

+ 改变数据形态：`map`, `mapTo`, `pluck`
+ 过滤一些值：`filter`, `skip`, `first`, `last`, `take`
+ 时间轴上的操作：`delay`, `timeout`, `throttle`, `debounce`, `audit`, `bufferTime`
+ 累加：`reduce`, `scan`
+ 异常处理：`throw`, `catch`, `retry`, `finally`
+ 条件执行：`takeUntil`, `delayWhen`, `retryWhen`, `subscribeOn`, `ObserveOn`
+ 转接：`switch`

**组合**

+ `concat` 保持原来的序列顺序连接两个数据流
+ `merge` 合并序列
+ `race` 预设条件为其中一个数据流完成
+ `forkJoin` 预设条件为所有数据流都完成
+ `zip` 取各来源数据流最后一个值合并为对象
+ `combineLatest` 取各来源数据流最后一个值合并为数组