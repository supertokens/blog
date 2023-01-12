---
title: 5 Tips for Optimizing Your React App’s Performance 
date: "2023-01-12"
description: "Poor app performance can reduce user engagement and will negatively affect SEO, here are 5 tips to optimize your react app"
cover: "optimize-react-app-performance.png"
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

### useCallback:

`useCallback` will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders

```tsx
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
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


## Tip 3: Debouncing and Throttling Event Actions

Debouncing is a technique used to improve the performance of frequently executed actions, by delaying them, grouping them and only executing the last call. For example, if you had a search field where results are queried as you are typing, you would 


Throttling is a technique used to improve the performance of frequently executed actions, by limiting the rate of execution. It is similar to debounce, except it guarantees the regular execution of an action.



## Tip 4: Virtualize long lists

There may be times where you need to display a large table or list that contains many rows. Loading every single item on such a list can affect performance significantly.

List virtualization, or "windowing", is the concept of only rendering what is visible to the user. The number of elements that are rendered at first is a very small subset of the entire list and the "window" of visible content moves when the user continues to scroll. This improves both the rendering and scrolling performance of the list


## Tip 5: Optimizing your images

Although it may seem obvious, large images can significantly impact the performance of your app. From poor load times to sluggish performance, there are clear demerits to not optimizing large images. To avoid these performance penalties, you can compress them, resize them, and serve them in an appropriate format (such as webp).

## Conclusion:

Poor app performance can reduce user engagement and will negatively affect SEO. By following these tips you will be able to diagnose performance issues with React Profiler, prevent unnecessary rerenders with `React.memo`, and add general improvements to your apps speed by adding a caching layer and optimizing images.
