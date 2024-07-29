---
title: 5 Tips for Optimizing Your React App’s Performance 
date: "2024-07-01"
description: "Poor app performance can reduce user engagement and will negatively affect SEO, here are 5 tips to optimize your react app"
cover: "optimize-react-app-performance.png"
category: "featured"
author: "Connor Peshek"
---

## Table of contents
## Table of Contents

1. [Introduction](#introduction)
2. [Understanding React Performance](#understanding-react-performance)
3. [Performance Optimization Techniques](#performance-optimization-techniques)
4. [Avoid Anonymous Functions in JSX](#avoid-anonymous-functions-in-jsx)
5. [Avoid Excessive Component Re-renders](#avoid-excessive-component-re-renders)
6. [Use Production Build](#use-production-build)
7. [Conclusion](#conclusion)


# Importance of Performance Optimization in React Apps

Optimizing performance in a React app isn’t just about being a good developer, it's important because less optimized pages make less money and rank lower on Google SEO. The internet is competitive. There are thousands of websites competing for everyone’s limited attention spans, and people hate to wait. People hate waiting so much that a report found that a site that loads in 1 second has a conversion rate 3x higher than a site that loads in 5 seconds. That’s a big difference. And around 2020, Google started using the core web vital metrics to factor in your Google ranking from a search result, meaning that less optimized sites rank lower on Google searches.

There are 3 main metrics used as part of core web vitals. There's Largest Contentful Paint (LCP), which rates how quickly the first main image or text is shown to the user; Interaction to Next Paint (INP), how responsive your website is to events such as scrolling, clicking, or inputting text; and Cumulative Layout Shift (CLS), which measures how much your website layout changes with different interactions.

So render time and performance matter, both for retaining customers and ranking on Google. But what can we do about it? There are lots of options for optimizing a web application, regardless of it being made with React. We can use a CDN, compress our images and lazy load them underneath the fold (lazy loading above the fold can hurt LCP), make our API calls as efficient as possible, remove unnecessary dependencies, and make sure we build our project in production mode in our bundler of choice. But what are things more specific to React that we can do?

In order to break down how to make our React code more efficient, let's first talk about how React works with the React Virtual DOM. 

## How does React’s Virtual DOM work?

The React Virtual DOM works by listening for state changes, comparing the DOM for any differences in its own virtual DOM, and then rendering any components that have had state changes, along with that component's children. Since it doesn't have to re-render the whole DOM, it makes rendering changes much faster. But there are lots of ways to accidentally write inefficient code in React, and there are lots of more advanced ways to write React that can massively optimize performance. Let’s walk through 11 different ways to optimize your React app.

## 11 React Performance Optimization Techniques

### Measure React Performance

React.profiler is a higher order component that can measure the performance of its child components, and the React DevTools allow you to see the React app’s performance directly inside your web browser.

It’s always good to know where your performance bottlenecks are when you want to start improving your application. You can do this programmatically by using the Profiler component. You give the Profiler component a callback in the `onRender` prop and can check render performance. For example, the following code would get render information on your whole React application:

```jsx
// src/index.js
import React, { Profiler } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const onRenderCallback = (
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions // the Set of interactions belonging to this update
) => {
  console.log('Profiler ID:', id);
  console.log('Phase:', phase);
  console.log('Actual Duration:', actualDuration);
  console.log('Base Duration:', baseDuration);
  console.log('Start Time:', startTime);
  console.log('Commit Time:', commitTime);
  console.log('Interactions:', interactions);
};

ReactDOM.render(
    <Profiler id="App" onRender={onRenderCallback}>
      <App />
    </Profiler>,
  document.getElementById('root')
);
```

You can also use the React Developer Tools in your web browser by installing the plugin from your browser’s extension marketplace - such as the Chrome Web Store - and opening your browser's developer tools. Two React tabs will be added to your developer console - components and profiler. The components tab can tell you details like props of rendered React components, and the profiler tab will allow you to record a rendering timeline of your React application. Simply click the record button and trigger a render, or click the refresh button to record all rendering times from a new page refresh. This can help you get a baseline of what components are rendering quickly and which ones could be causing performance bottlenecks. You can also check things like why a component is re-rendering and use some of the tips later in the article to correct it.

### Code splitting and lazy loading

Code splitting allows you to break your front-end react bundle into smaller chunks that can be downloaded together in parallel or at the time they are needed, and lazy loading allows you to load less important parts of an application later, improving application performance. These combined can help increase initial load times for an application, affecting our LCP metric.

By default, reactjs sends one .js file - usually bundled together by a bundler like webpack - which includes all of your react application and runs it in the client’s browser. This is fine if your app is small, but as your app grows in size, this becomes a bottleneck. Also, some pieces of your app are more important to load first. Getting the user the ProductSearch component on an e-commerce page is a much higher priority than getting them the admin page 99% of users will never see.

You can set up lazy loading in React using React.lazy and React.suspense. When using lazy and suspense, react will automatically code split the components that will be lazy loaded and grab them when they’re needed. This keeps the main bundle small and makes your initial render much quicker. But be sure to not lazy load anything above the fold, as that can actually drop your LCP score.

```typescript
// src/index.js
import ReactDOM from 'react-dom/client';
import React, { Suspense, lazy, useState } from 'react';
import './App.css';

// this component will be removed from the bundle and fetched when needed
const MyComponent = lazy(() => import('./MyComponent'));
// this component is also removed from the bundle and fetched when needed.
// This results in 3 separate .js files
const MyOtherComponent = lazy(() => import('./MyOtherComponent'));

const App = () => {

  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
<MyComponent />
<MyOtherComponent />
      </Suspense>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### Implement React server-side rendering (SSR)

Server-side rendering is when the page is rendered on the server and then sent over to the client instead of sending a bundle that is rendered client-side. The client’s cpu is not usually a bottleneck for a react application, but bandwidth and latency between the client and server commonly are. By rendering server-side, we can grab all of the data we need from the database before rendering our page, which removes extra trips to the server and can speed up rendering.

[Nextjs](https://nextjs.org/), made by the same people who [made the Vercel deployment platform](https://supertokens.com/blog/how-to-deploy-supertokens-with-react-nodejs-express-on-vercel), is the most popular way to implement SSR in React, and it’s very simple to use. You can simply run

```bash
npx create-next-app@latest your-app-name
```


to generate a nextjs project. Everything will render server-side by default, with the option to render specific components client-side if necessary.

### Virtualize lists

List virtualization, also known as windowing, is when you only render the part of a list that is visible to the user. This helps reduce DOM nodes on a page and make scrolling smoother, which can increase your INP score.

Let’s say you have an e-commerce store and someone does a search for "The". I don't know why they would do that, but it's the most common word in the English language, meaning you’ll probably have to render a pretty long list of results. If we virtualize the list instead of rendering all thousand entries, we can cut down on the render time and prevent freezing while scrolling.

There are many libraries, such as react-virtualized, react-window (an updated, lightweight alternative to react-virtualized made by the same team), and react-virtuoso, that can make implementing virtualized lists simple. 


### Properly use React's Keys property when rendering a list

React requires giving every item in a generated list of jsx a unique key. People tend to use the array index to handle this, but this can cause unnecessary re-renders. Keys are used by react to tell if it needs to re-render items in the list. If you use the array index and then an item is removed or the array is sorted, the keys in the new list will no longer match the old index keys, and all of those items will have to be re-rendered. If we use unique keys, like a userId, we can prevent React from needing to re-render any items in the list when the list’s order changes.

Good idea

```js
// index.js
import ReactDOM from 'react-dom/client';
import React from 'react';

const App = () => {
  const users = [
    { userId: 1, name: 'Alice', email: 'alice@example.com' },
    { userId: 2, name: 'Bob', email: 'bob@example.com' },
    { userId: 3, name: 'Charlie', email: 'charlie@example.com' },
  ];
  
  
    return (
      <div className="App">
        <h1>User List</h1>
        <ul>
        {users.map(user => (
          <li key={user.userId}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
  
      </div>
    );
  };
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```