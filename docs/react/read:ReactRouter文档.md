---
slug: router
tags: [react]
---

:::tip
- [reactrouter文档](https://reactrouter.com/en/main)
- [examples](https://github.com/remix-run/react-router/tree/dev/examples)
:::

首先，使用vite创建一个react工程：`npm create vite@latest name-of-your-project -- --template react`
然后，安装依赖包`react-router-dom`及其他所需的依赖包：`npm install react-router-dom localforage match-sorter sort-by`
> 使用ts的话需要安装类型声明：`npm install --save-dev @types/sort-by`
> localForage 在不支持 IndexedDB 或 WebSQL 的浏览器中使用 localStorage，在支持 IndexedDB 的浏览器中使用IndexedDB。


Anytime your app throws an error while rendering, loading data, or performing data mutations, React Router will catch it and render an error screen. 任何时候您的应用程序在渲染、加载数据或执行数据突变时抛出错误，React Router 都会捕获它并渲染错误屏幕。

### 1. createBrowserRouter
- path
- element
- errorElement
- loader
  - 与useLoaderData结合使用；
  - URL Params会传递给loader, For example, our segment is named `:contactId` so the value will be passed as `params.contactId`.
  - loader可以共享，但尽量每个route有自己的loader
- action  loader和action都能接收request
- children

### 2. RouterProvider

### 3. useRouteError
provides the error that was thrown

### 4. Form
`<Form>`与`<form>`的区别是，`<Form>` 阻止浏览器将请求发送到服务器，而是将其发送到您的route action(包括FormData)
```jsx
<Form method="post">
  <button type="submit">New</button>
</Form>

// 如下指定route action
// React Router automatically revalidate the data on the page after the action finishes. React Router在该action完成后会自动重新验证页面上的数据，即会触发loader。
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: 'contacts/:contactId',
        element: <Contact />,
      },
    ],
  },
])

// 或者使用 Form 的 property---action 指定action
<Form action="edit">
  <button type="submit">Edit</button>
</Form>

// 定义action
export async function action({ request, params }: { request: any, params: any }) {
  const formData = await request.formData();
  const firstName = formData.get("first");
  const lastName = formData.get("last");
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}
```

### 5. Outlet

### 6. Link
allows our app to update the URL without requesting another document from the server. 通过查看the network tab in the browser devtools可以看到`<Link to>`与`<a href>`的区别，`<Link to>`不需要requesting documents

### 7. useLoaderData
接收loader指定的函数返回的值

### 8. redirect

### 9. NavLink
当用户位于 NavLink 中的 URL 时，isActive 将为真。当它即将激活（数据仍在加载）时，isPending 将为真。这使我们能够轻松地指示用户所在的位置，并对已单击但我们仍在等待数据加载的链接提供即时反馈。