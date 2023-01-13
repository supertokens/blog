---
title: 5 Tips for Optimizing Your React App’s Performance 
date: "2023-01-12"
description: "Poor app performance can reduce user engagement and will negatively affect SEO, here are 5 tips to optimize your react app"
cover: "optimize-react-app-performance.png"
category: "featured"
author: "SuperTokens Team"
---

## Table of contents
- [Introduction](#introduction)
- [Tip 1: Reduce unnecessary renders](#tip-1-reduce-unnecessary-renders)
- [Tip 2: Lazy loading with code splitting](#tip-2-lazy-loading-with-code-splitting)
- [Tip 3: Debouncing and Throttling](#tip-3-debouncing-and-throttling-event-actions)
- [Tip 4: Virtualize long lists](#tip-4-virtualize-long-lists)
- [Tip 5: Optimizing your images](#tip-5-optimizing-your-images)

## Introduction:

One of the most frustrating things as a React developer is investing time and effort into building an application only to find it slow and unresponsive.

In this post, we’ll go over 5 tips to improve the performance of your React app.


## Tip 1: Reduce unnecessary renders

Unnecessary rerenders can slow down your apps making them feel sluggish and unresponsive.

By leveraging some of React's built-in hooks, we can keep unnecessary renders at a minimum.


### React.Memo:

In React, components will re-render when state or prop values change. This also applies to child components where props might remain the same but the parent component’s props change. 

In this case, we can use “React.memo()”, a higher-order component to cache the output of the child component. Now the child component will be rendered only when its props change. This can be very useful for components that have many props that do not change frequently.


```tsx
const myComponent = React.memo((props) => {
    /* render using props */
});

export default myComponent;
```

You can find the React documentation on how to use React memo [here](https://beta.reactjs.org/reference/react/memo).

### useCallback:

`useCallback` will return a memo-ized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.

```tsx
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

## Tip 2: Lazy loading with code splitting

As your app grows larger with third-party libraries and more functionality, so will your app's bundle. This, in turn, will increase the load time of your app. 

To combat this, we can split the bundle and only load what is currently needed. In React, this can be done by dynamically importing components with the React.lazy function.

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

Debouncing is a technique used to improve the performance of frequently executed actions by delaying them, grouping them, and only executing the last call. For example, if you have a search field where results are queried as you are typing, making API calls for each keystroke would be extremely inefficient since we only care about the final result. In this case, a debounce function would be extremely useful, essentially only calling the search API after a pre-determined timeout.


Throttling or rate limiting is a technique used to improve the performance of frequently executed actions, by limiting the rate of execution. It is similar to debouncing, except it guarantees the regular execution of an action. This is most useful for high-frequency event actions like resizing and scrolling which cause React components to re-render. Since we don't need to keep these actions 100% in sync we can call the handlers of these events intermittently. 

You can learn more about throttling and debouncing components [here](https://codefrontend.com/debounce-throttle-js-react)

## Tip 4: Virtualize long lists

If you need to display a large table or list that contains many rows, loading every single item on the list can significantly affect performance.

List virtualization, or "windowing", is the concept of only rendering what is visible to the user. The number of elements that are rendered at first is a small subset of the entire list and the "window" of visible content moves when the user continues to scroll. This improves both the rendering and scrolling performance of the list.

You can use the [react-window](https://www.npmjs.com/package/react-window) library to start virtualizing lists in your app.


## Tip 5: Optimizing your images

Although it may seem obvious, large images can significantly impact the performance of your app. From poor load times to sluggish performance, there are clear demerits to non-optimized large images. To avoid these performance penalties, you can compress them, resize them, and serve them in an appropriate format (such as webp). The best way about going about doing this 

## Conclusion:

Poor app performance can reduce user engagement and negatively affect SEO. By following these tips, you will be able to improve performance with debouncing, throttling and virtualizing long lists, prevent unnecessary re-renders with `React.memo`, and add general improvements to your app's speed by optimizing images.
