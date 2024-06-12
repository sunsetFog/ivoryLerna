# UI相关代码重构经验参考
理想情况下，把现有UI相关代码分解成颗粒大小不同的组件，
这些组件如果去除了不同站的差异性则可以跨站共享，去除了不同端的差异性，
则可以跨端共享。

## ui组件的样式该如何分割以保持终端项目的灵活性？
建议分割两大部分
- layout.module.scss 负责组件的布局相关的样式
- style.module.scss 负责组件具体样式风格，依赖layout.module.scss

终端项目则可以只重用布局layout.module.scss，而选择重写样式风格。
这种分割方式适应以下两种情况。

custom.module.scss文件内容可能是
```scss
@import "components/carousel/layout.module.scss";
// 全部重写具体风格样式
```
或是
```scss
@import "components/carousel/style.module.scss";
// 微调风格样式
```

## 对于图像部分的处理
### img标签引用的图像
img标签引用的图像，可以设计成组件的接口
图片以参数的形式传给重用组件。

```tsx
import { VFC } from "react";
import img1 from 'path/to/img1.png'
import Component from 'path/to/component'

const Page: VFC = ({}) => {
  return <Component images={{
    img1
  }} />
}

export default Page
```

### css background形式的图像

创建 custom.module.scss 引用组件共享的 style.module.scss
```scss
// import 公用的样式
@import 'path/to/component/style.module.scss';
// 同名selector
.selector {
  // 直接补充具体图像引用声明
  background-image: url('path/to/img.png')
}
```
最后可以把 styles 作为参数传递给组件，完成了定制的过程。
```tsx
import { VFC } from "react";
import Component from 'path/to/component'
import styles from 'path/to/custom.module.scss'

const Page: VFC = ({}) => {
  return <Component styles={styles} />
}

export default Page
```

## 共用的业务UI组件涉及了后台接口请求该怎重构？

可以通过定义组件异步函数接口方法来解决，
该设计模式重点在于分离公用业务组件对请求模块的依赖。
下面是示例代码：

```tsx
import { VFC } from 'react'
import useSWR from 'swr'

interface IFetchData1Result {
  field1: string
  field2: string
}
interface IFetchData2Result {
  field3: string
  field4: string
}
interface IComponent {
  fetchData1: () => Promise<IFetchData1Result>
  fetchData2: () => Promise<IFetchData2Result>
}

// 业务组件定义好异步函数接口
export const Component: VFC<IComponent> = ({ fetchData1, fetchData2 }) => {
  const { data: result1, error } = useSWR<IFetchData1Result>(
    'uniqueCacheKey', // 不是必须写成接口path形式，但要保持全局唯一性
    fetchData1,
    {
      revalidateIfStale: false,
    }
  )

  if (error)
    return (
      <div>
        failed to load.
        <p>error:{error.message}</p>
      </div>
    )
  if (!result1) return <div>loading...</div>
  return (
    <>
      <p>{result1}</p>
      <button
        onClick={() => {
          fetchData2().then(_res => {
            console.log(_res)
          })
        }}
      >
        获取数据
      </button>
    </>
  )
}

// 在页面中使用Component
export const Page: VFC = () => (
  <Component
    fetchData1={() => post<IFetchData1Result>('/restful/api1')}
    fetchData2={() => post<IFetchData2Result>('/restful/api2')}
  />
)
```
