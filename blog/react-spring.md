[react-spring](https://react-spring.dev/) 是一个用于构建交互式、数据驱动和动画 UI 组件的库。它可以为 HTML、SVG、Native Elements、Three.js 等制作动画。
```bash
yarn add @react-spring/web
pnpm add @react-spring/web
```

[使用 react-spring 打造流暢的使用者體驗](https://jigsawye.com/2021/04/23/react-spring)

## `animated`组件
处理动画的实际组件是`animated`组件，其是一个高阶组件 (HOC)。（高阶组件是一个接受一个组件并返回一个新组件的函数）
```jsx
import { animated } from '@react-spring/web'

export default function MyComponent() {
  return (
    <animated.div
      style={{
        width: 80,
        height: 80,
        background: '#ff6d6d',
        borderRadius: 8,
      }}
    />
  )
}
```

## API
### `Globals`
`Globals` 是一个内部对象，用于配置全局属性，比如默认的弹簧配置或插值器。这些全局设置会影响所有 react-spring 动画的默认行为。请注意，`Globals` 的使用应该谨慎，因为它会影响你应用中所有的 react-spring 动画。通常，它只在应用初始化时设置一次，并且很少需要修改。

`skipAnimation`: 如果`skipAnimation`设置为`true`，那么动画将“跳转”到目标值，类似于`immediate`属性为`true`时。
```jsx
import { useRef, useEffect } from 'react'
import { useSpring, animated, Globals } from '@react-spring/web'

export default function MyApp() {
  const isRight = useRef(false)

  const [springs, api] = useSpring(
    () => ({
      x: 0,
    }),
    []
  )

  const handleClick = () => {
    api.start({
      x: isRight.current ? 0 : 200,
      onRest: () => {
        isRight.current = !isRight.current
      },
    })
  }

  useEffect(() => {
    Globals.assign({
      skipAnimation: true,
    })

    return () => {
      Globals.assign({
        skipAnimation: false,
      })
    }
  })

  return (
    <animated.div onClick={handleClick} className="spring-box" style={springs}>
      Click me!
    </animated.div>
  )
}
```

## Hooks
### `useSpring`
`useSpring` 实际上并没有为任何东西设置动画。它只是返回我们传递给`animated`组件的 `SpringValues`。以下是一些常用的属性：
- `from`: 定义动画开始时的样式或状态。
- `to`: 定义动画结束时的样式或状态。
- `config`: 定义动画的配置，如弹簧的张力（tension）、摩擦力（friction）等。
- `delay`: 设置动画延迟开始的时间（以毫秒为单位）。
- `reset`: 如果设置为 true，动画将重置到 `from` 状态并重新开始。
- `reverse`: 如果设置为 true，动画将从 `to` 状态反向运行到 `from` 状态。
- `immediate`: 如果设置为 true 或一个函数返回 true，动画将立即跳转到结束状态，不会有过渡效果。
- `onStart`: 动画开始时的回调函数。
- `onRest`: 动画静止时的回调函数。
- `onUpdate`: 动画更新时的回调函数。
- `loop`: 如果设置为 true 或一个函数，动画将循环播放。
- `pause`: 如果设置为 true，动画将暂停。

如下将`useSpring`返回的`springs`应用于`animated`组件，则初始化时发生动画(向右移动)：
```jsx
import { useSpring, animated } from '@react-spring/web'

export default function MyComponent() {
  const springs = useSpring({
    from: { x: 0 },
    to: { x: 100 },
  })

  return (
    <animated.div
      style={{
        width: 80,
        height: 80,
        background: '#ff6d6d',
        borderRadius: 8,
        ...springs,
      }}
    />
  )
}
```

`useSpring`接收两种类型的参数，一种是如上的config对象，另一种是函数。当其参数是函数时，它返回一个数组：
```jsx
import { useSpring, animated } from '@react-spring/web'

export default function MyComponent() {
  const [springs, api] = useSpring(() => ({ // api用于控制springs
    from: { x: 0 },
  }))

  const handleClick = () => {
    api.start({ // api有许多不同的方法，我们可以使用它们来控制动画。
      from: {
        x: 0,
      },
      to: {
        x: 100,
      },
    })
  }

  return (
    <animated.div
      onClick={handleClick}
      style={{
        width: 80,
        height: 80,
        background: '#ff6d6d',
        borderRadius: 8,
        ...springs,
      }}
    />
  )
}
```

#### [`cancel`属性](https://geek-docs.com/reactjs/reactjs-top-articles/1701095031_g_react-spring-cancel-prop.html)
当`cancel`设置为true时，动画将停止工作，设置为false时，动画将重新开始。

### `useReducedMotion`