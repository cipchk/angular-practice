# 避免陷阱

本篇章将介绍一些在Angular应用中的由于使用不当引起不必要的麻烦。

## 一、`Http` 需要取消订阅吗？

首先，先来看一下：

```typescript
const sub = Observable.fromEvent(node, 'input')
  .map((event: any) => event.target.value)
  .filter(value => value.length >= 2)
  .subscribe(value => {
      console.log(value);
  });
```

`Observable.fromEvent` 内部实际是利用 `addEventListener` 对DOM元素添加一个事件监听；而对事件的移除变得非常重要，这是因为对但一个事件被记录以后，取触发是用户在决定什么时候录入以后会产生触发。因此，这会让我们产生另一个问题，我们是无法得知用户是否已经不打算录入，除非用户关掉浏览器。所以，移除事件会变得非常重要，因为如果不移除事件所关联的方法会持续一直被占用，从而会形成**内存泄露**危险，我们把这种行为称为：**无限值**。

回过头来看示例中 `Observable.fromEvent`，如果调用 `sub.unsubscribe()` 会执行 `removeEventListener` 动作。

接着，再来看一个 `Http` 示例。

```typescript
const sub = this.http
  .get('/my')
  .subscribe(value => {
      console.log(value);
  });
```

对于 `Http` 其内部实际是产生一个 xhr 请求对象，大概如下：

```typescript
let xhr = new XMLHttpRequest();
xhr.addEventListener('load', () => {
  if (response.ok) {
    responseObserver.next(response);
    responseObserver.complete();
  } else {
    responseObserver.error(response);
  }
}));
xhr.send();
```

当请求返回成功后直接调用观察者的 `next` 与 `complete`。虽然这里也有 `addEventListener` 动作，但是相比较DOM事件而已，我们不必担心，因为当调用 `complete` 会表示其已经结束；同时，对于这里的事件而言已经不会再被调用，从而JavaScript会在适当的时候自动销毁，我们把这种行为称为：**有限值**。

**因此：对于无限值务必要手动取消订阅，反之可以不需要。**

二、不要嵌套 `Observable`

很多情况下，一个数据请求可以需要依赖于另一个请求时，可能会这么写：

```typescript
this.userSrv.get().subscribe(user => {
  this.getList(user.id).subscribe(list => {
    console.log(user, list);
  });
});
```

我们又回到类似回调地狱的那种状态。而其实 `Observable` 只需要使用 `flatMap` 很容易避开这种状态，而且非常优雅。

```typescript
this.userSrv.get()
    .do(user => {
      this.user = user;
    })
    .flatMap(user => this.getList(user.id))
    .subscribe(list => {
      console.log(user, list);
    });
```