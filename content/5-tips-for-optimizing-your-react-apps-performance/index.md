---
title: What do pre-built authentication UIs look like? 
date: "2023-01-11"
description: "A comparison of the pre-built UIs from current authentication providers and how to customize them"
cover: "prebuilt-auth-ui-comparison-banner.png"
category: "featured"
author: "SuperTokens Team"
---

## Introduction:

One of the most frustrating things as a React developer is investing time and effort into building an application only to find the app to be slow and unresponsive.
In this post, we’ll go over 5 tips to improve the performance of your React app.

## Tip 1: Reduce unnecessary renders

Rendering components is an expensive operation and unnecessary renders can come at an extreme cost to performance.
By leveraging some of React's built-in functionality we can keep unnecessary renders at a minimum.

### React.Memo:

In React, components will re-render when state or prop values change. This also applies to child components where props might remain the same but the parent component’s props change. In this case, we can use “React.memo()” higher order component to cache the output of the child component. Now the child component will on be rendered when its props change. This can be very useful for components that have lots of props that do not change very often.

```tsx
const myComponent = React.memo((props) => {
    /* render using props */
});

export default myComponent;
```

You can find the React documentation on how to use React memo [here](https://beta.reactjs.org/reference/react/memo).

### shouldComponentUpdate lifecycle hook
If you are using class-based components and need even more control on when your component re-renders, you can use the shouldComponentUpdate lifecycle method.

Depending on changes to state or props you can specify whether or not the component should be re-rendered. By returning false from shouldComponentUpdate, you can prevent the rerendering even if its props or state have changed.

```tsx  
class myComponent extends Component {
  shouldComponentUpdate(nextProps) {
   // Condition for whether the component should update
  }
}
```


## Tip 2: Lazy loading with code splitting

As your app grows bigger so will your app's bundle. Especially when you start incorporating third-party libraries. This, in turn, will increase the load time of your app. To combat this we can split the bundle and only load what is currently needed. In React this can be done by dynamically importing components with the `React.lazy` function.

Before: 

`import OtherComponent from './OtherComponent';`

After:

`const OtherComponent = React.lazy(() => import('./OtherComponent'));`

This will automatically load the bundle containing the `OtherComponent` when this component is first rendered.

The lazy component should then be rendered inside a `Suspense` component, which allows us to show some fallback content (such as a loading indicator) while we’re waiting for the lazy component to load.

```tsx
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```
You can find the complete docs on code splitting [here](https://reactjs.org/docs/code-splitting.html).


## Tip 3: Tip 3: Use a caching layer

If your app frequently requests data from an external API, you may want to consider implementing a caching layer to store repeatedly used data. Reducing the number of API requests can significantly speed up your app.

## Tip 4: User a Performance Monitoring Tools

Trying to manually diagnose a performance bottleneck in your application can also be a frustrating experience. This is where tools like React Performance Devtool and React Profiler come in handy. React Performance Devtool is a browser extension for inspecting the performance of React Components. It statistically examines the performance of React components based on the measures which are collected by React using `window.performance` API. The React Profiler API is more specific and its primary purpose is to measure the cost of rendering a component. This can be used to find which parts of your application are slow and might benefit from caching suggestion mentioned in Tip 1.

By incorporating these tools into your workflow, you can catch performance issues early on and fix them before they become a problem.

## Tip 5: Optimizing your images

Although it may seem obvious, large images can significantly impact the performance of your app. From poor load times to sluggish performance, there are clear demerits to not optimizing large images. To avoid these performance penalties, you can compress them, resize them, and serve them in an appropriate format (such as webp).

## Conclusion:

Poor app performance can reduce user engagement and will negatively affect SEO. By following these tips you will be able to diagnose performance issues with React Profiler, prevent unnecessary rerenders with `React.memo`, and add general improvements to your apps speed by adding a caching layer and optimizing images.
