
## Table of Contents

| No. | Questions |
| --- | --------- |
||**Dotnet core**|
|1   |	[What is ASP.NET MVC Core?](#what-is-asp.net-mvc-core)	|
|2   |	[Difference between Webform, MVC 5 and .NET Core?](#difference-between-webform,-mvc-5-and-.net-core)	|
|3   |	[What is MVC Architecture](#what-is-mvc-architecture)	|
|4   |	[Why do we have wwwroot folder?](#why-do-we-have-wwwroot-folder)	|
|5   |	[Explain appsettings.json](#explain-appsettings.json)	|
|6   |	[How to read configuration from appsettings.json?](#how-to-read-configuration-from-appsettings.json)	|
|7   |	[What is dependency injection?](#what-is-dependency-injection)	|
|8   |	[Why do we need DI?](#why-do-we-need-di)	|
|9   |	[How do we implement DI?](#how-do-we-implement-di)	|
|10  |	[What is use of Middleware?](#what-is-use-of-middleware)	|
|11  |	[How to do implement?](#how-to-do-implement)	|
|12  |	[Differernce between ConfigureServices & Configure method in Startup.c](#differernce-between-configureservices-&-configure-method-in-startup.c)	|
|13  |	[Difference between Scoped vs Transient vs Singleton?](#difference-between-scoped-vs-transient-vs-singleton)	|
|14  |	[What is razor?](#what-is-razor)	|
|15  |	[What is Kestrel?](#what-is-kestrel)	|
|16  |	[Why Kestrel?](#why-kestrel)	|
|17  |	[what are cookies?](#what-are-cookies)	|
|18  |	[Session management?](#session-management)	|
|19  |	[Different ways of doing session management?](#different-ways-of-doing-session-management)	|



1. ### What is ASP.NET MVC Core?

It is an open source *cross platform* web development framework to develop web application created by Mircosoft

2. ### Difference between Webform, MVC 5 and .NET Core?

|| Webform | MVC5 | .NET Core |
|---|---|---|---|
|Cross platofrm|No|No|Yes|
|Performance|Slow|Better|Best (dll is divided more)|
|Simplification | complicated| Medium complicated|  Very simplified|
|Cloud | No| Not complete|Yes|
|Self hosting | No| No |Yes (Kestrel) |

3. ### What is MVC Architecture

It is archtecture pattern.

4. ### Why do we have wwwroot folder?

We can store static content like HTML, css, js files

5. ### Explain appsettings.json

Appsettings.json file helps to store config information

6. ### How to read configuration from appsettings.json?

By IConfiguration 

7. ### What is dependency injection?

DI is practice of providing dependent objects from outside rather then creating inside class

8. ### Why do we need DI?

* High level modules should not depend on low-level modules
* Decoupling

9. ### How do we implement DI?

Change in one place, it is reflect in all places

```c#
ConfigureServices()
{
    services.AddScoped(typeof(IRequestDeal<>), typeof(DealDomain<>));
}
```

10. ### What is use of Middleware?

Middleware helps to execute pre-processing logic before controller is executed

Middleware components are pieces of code, which are added to your application’s pipeline and have the job of handling each request and response

11. ### How to do implement?

Step 1: 
Create middleware class (From template)

Step 2: 
Inside Invoke we can write logic 

Step 3: 
In configure method from startup.cs

```c#
app.UseMiddleware<CustomMiddleware>();
```

12. ### Differernce between ConfigureServices & Configure method in Startup.cs

ConfigureServices - helps to configure dependency object

Configure - helps us to configure middleware

13. ### Difference between Scoped vs Transient vs Singleton?

* *AddScoped* - With scoped service, we get same instance within scope of given http request but new instancce accross diferent http requests

* *AddTransient* -  With transient service,  <u>a new instance is provided every time an instance is requested</u> whether it is scope of same http request or across different http requests

* *AddSingleton* - When service is first requested and that single instance is used by all http requests throughout application.

|| In scope of given http request  | Across different http requests | 
|---|---|---|
|Scoped|Same instance|New instance|
|Transient|New instance|New instance|
|Singleton|Same instance|Same instance|

14. ### What is razor?

Razor is view engine in which we can write html and c# code

Can write server side in cshtml page starting with @

15. ### What is Kestrel?

Open source web server

16. ### Why Kestrel?

Kestrel is cross platform

17. ### what are cookies?

Cookies are text files which stores in end user website

18. ### Session management?

Session management techniques helps to maintain states between HTTP requests.

19. ### Different ways of doing session management?

* Session
* ViewData
* ViewBag
* TempData