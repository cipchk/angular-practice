# @Input

组件或指令需要接收一个外部的数据，这是理所当然的。

## 长什么样？

通过 `@Input()` 装饰器，告知这个属性允许外部提供数据。

{% raw %}
 ```typescript
@Component({
  selector: 'user-detail',
  template: `<p>user id: {{userId}}</p>`
})
export class UserDetailComponent {
  @Input() userId: number;
}
``` 
{% endraw %}

于是，需要用到 `user-detail` 组件，都可以向它传递一个 `userId` 值。

```html
<user-detail [userId]="uid">
```

## 属性太难看了

是的，和我一样有洁癖的，是不会允许 `[userId]` 的写法和 `user-detail` 这种写法不搭。

我认知的写法应该是这样：

```html
<user-detail [user-id]="uid">
```

这样看起来才爽。但，等等，`user-detail` 也应该换一下。

```typescript
@Input('user-id') userId: number;
```

## 监听变更

用户ID `user-id` 属性值是由外部传递进来的，但当传递一个小于0的值时是无任何意义，或者说，我们并不希望接收到一个小于0数值时，怎么办？

### 方法一：get & set

ts 语言支持利用getters/setters来控制对成员的访问，因此，我们可以利用这一点。

```typescript
private _uid: number;

@Input('user-id')
set userId(uid: number): void {
    if (uid <= 0) throw new Error('invalid uid');
    this._uid = uid;
}
get userId(): number {
    return this._uid;
}
```

### 方法二：`ngOnChanges` 钩子

需要实现 `OnChanges` 接口，这样 Angular 将会主动调用 `ngOnChanges` 钩子，`SimpleChanges` 参数会包括所有变更的属性值。

{% raw %}
 ```typescript
@Component({
  selector: 'user-detail',
  template: `<p>{{user.name}}</p>`
})
export class UserDetailComponent implements OnChanges {
  @Input('user-id') userId: number;

  ngOnChanges(changes: SimpleChanges): void {
    if ('userId' in changes) {
      // changes.userId.firstChange 是否第一次变更
      // changes.userId.currentValue 变更后值
      // changes.userId.previousValue 变更前值
    }
  }
}
``` 
{% endraw %}

### 二者区别

都可以达到监听变更后的新值，但有很大的区别。

+ `get & set` 只对当前属性有效。
+ `ngOnChanges` 对多个属性变更后才会触发通知，因此，参数接收到的是所有变更属性值集合对象。

因此，如果你对单一个的变更监听前者更适宜，反之。