---
title: Setting up an authentication form with bootstrap in a Django application
date: "2024-07-10"
description: "This tutorial wil guide you on how you can setup a bootstrap login template in Django"
cover: "django_bootstrap_banner.png"
category: "programming"
author: "Nemi Shah"
---


## Table of Contents

1. [High Level Refresher](#high-level-refresher)
2. [Prerequisites](#prerequisites)
3. [Setting up a Django Application](#setting-up-a-django-application)
4. [Editing Project Configs](#editing-project-configs)
    - [django_login/settings.py](#djangologinsettingspy)
    - [django_login/urls.py](#djangologinurlspy)
5. [Building the Login Screen with Bootstrap](#building-the-login-screen-with-bootstrap)
    - [login/templates/registration/login.html](#logintemplatesregistrationloginhtml)
6. [Running the Application](#running-the-application)
7. [Conclusion](#conclusion)


## High Level Refresher

**Django** is a high-level Python framework that follows the model-template-views architectural pattern. Django is one of the most [popular web frameworks](https://www.jetbrains.com/lp/devecosystem-2022/python/) due to its security, scalability, and flexible design. Companies like Instagram, Reddit, and Dropbox all used Django. 

**Bootstrap** is an open-source CSS framework that provides pre-built HTML, CSS, and JavaScript components. This includes elements such as navigation bars, forms, buttons, modals, and more. Originally created by Twitter, Bootstrap is now maintained by a large developer community.

## Prerequisites

- A basic understanding of HTML, CSS, and Javascript
- A basic understanding of Django
- [Python3](https://www.python.org/downloads/) installed on your machine
- [Django](https://docs.djangoproject.com/en/4.1/topics/install/) installed on your machine

## Setting up a Django application

Let’s first create a project. In your command line, find the correct directory, and run the following command: 

```jsx
$ django-admin startproject django_login
```

This creates the project we’ll be working in. From there, we’ll need to create an application. Since we’re building a login screen, navigate into the project with `cd django_login`, and run the following command: 

```jsx
$ python3 manage.py startapp login
```

Let’s now run the server to test if everything has been set up correctly. Run the following command: 

```jsx
$ python3 manage.py runserver
```

By deploying our Django application, we can check in real-time if the build is compiling correctly. Since we have only initialized our Django application, in [localhost:8000/](http://localhost:8000/), you should see the following webpage:

![Django homepage](./django_landing_page.png)

Below is a command-line screenshot of setting up a Django application from scratch. 

![Django setup terminal](./django_terminal.png)

## Editing Project Configs

**django_login/settings.py**

First, we’ll notify our project that we’ve created an application. To do this, go into the `django_login` folder and find the `settings.py` file. Scroll down to the `INSTALLED_APPS` section and add `'login'` (our application name) to the list of applications.

![Django code setup](./django_application_setup.png)

**django_login/urls.py**

From there, we’ll need to edit the `urls.py` file to account for our new application. We will be using the [built-in `LoginView`](https://docs.djangoproject.com/en/4.1/topics/auth/default/) from Django which will display the login form and process the login action. 

Replace the template code with the following:

```python
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LoginView

urlpatterns = [
    path('', LoginView.as_view()),
    path('login/', include('login.urls')),
    path('admin/', admin.site.urls),
]
```

## Building the login screen with Bootstrap

**login/templates/registration/login.html**

First, within the `login` folder, we’ll need to create a `templates` folder, and then a `registration` folder within. From there, we’ll create a `login.html` file.

Because we’re using the built-in `LoginView` of Django, we must provide the HTML template with the `registration/login.html` format. 

Inside `login.html`, we’ll add the following Bootstrap code (delivered via CDN for convenience, though there are [other Bootstrap installation methods](https://getbootstrap.com/docs/5.3/getting-started/download/)):

```html
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="utf-8"&gt;
    &lt;meta http-equiv="X-UA-Compatible" content="IE=edge"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
    &lt;title&gt;Signin&lt;/title&gt;
    &lt;link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"&gt;    
    &lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"&gt;&lt;/script&gt;
    
  &lt;/head&gt;
  &lt;body class="text-center"&gt;
    &lt;form class="form-signin"&gt;
      &lt;h1 class="h3 mb-3 font-weight-normal"&gt;Django Login Demo&lt;/h1&gt;
      {% csrf_token %}
      &lt;input id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="" type="email"&gt;
      &lt;input id="inputPassword" class="form-control" placeholder="Password" required="" type="password"&gt;
      &lt;div class="checkbox mb-3"&gt;
        &lt;label&gt;
          &lt;input value="remember-me" type="checkbox"&gt; Remember me
        &lt;/label&gt;
      &lt;/div&gt;
      &lt;button class="btn btn-lg btn-primary btn-block" type="submit"&gt;Sign in&lt;/button&gt;
    &lt;/form&gt;
  &lt;/body&gt;
&lt;/html&gt;

&lt;style&gt;
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-align: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}

.form-signin .form-control:focus {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
&lt;/style&gt;
```

**login/views.py**

Now that we have our HTML, we need to render it in Django. Go to the `views.py` file and replace the template code with the following:

```python
from django.shortcuts import render

def index(request):
    return render(request, 'authentication/login.html')
```

## Running the application

Once everything is set up, your `login` folder structure should look like this:

![Django directory structure](./django_directory_structure.png)

When we run python `manage.py runserver`, the following webpage should show up on your localhost.

![django login page](./django_login_page.png)

Great success!

## Conclusion

Congrats - you’ve created a login screen using Django with Bootstrap! You’ll still need to set up the authentication logic (hashing & storing the user credentials, session management, building the signup and forgot password screens, and redirecting post-login).

But for now - time to celebrate!

At SuperTokens, we simplify your authentication process - and help you set up a fully functioning [Django authentication flow](https://github.com/supertokens/supertokens-python/tree/master/examples/with-django/with-thirdpartyemailpassword) within minutes. Check us [out](https://supertokens.com) or message us on [Discord](https://supertokens.com/discord)!