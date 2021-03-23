# Design Principle

## Table of Contents

| No. | Questions |
| --- | --------- |
||**Design Principle**|
|	1	|	[What is Design principle?](#what-is-design-principle)	|
|	2	|	[What if we don't follow SOLID principles](#what-if-we-dont-follow-solid-principles)	|
|	3	|	[Single Responsibility Principle](#single-responsibility-principle)	|
|	4	|	[Interface Segregation Principle](#interface-segregation-principle)	|
|	5	|	[Open closed principle](#open-closed-principle)	|
|	6	|	[Liskov substitution principle](#liskov-substitution-principle)	|
|	7	|	[Dependency inversion principle](#dependency-inversion-principle)	|
|	8	|	[What is YAGNI](#what-is-yagni)	|
|	9	|	[What is KISS](#what-is-kiss)	|
|	10	|	[What is DRY](#what-is-dry)	|



1. ### What is Design principle?

* Design principle enable us manage most of software design problems
* SOLID Principles are subset of many principles promoted by Uncle Bob (Robert C Martin)

Different types of design principle
* SOLID
* YAGNI
* KISS
* DRY

2. ### What if we don't follow SOLID principles
 
* End up with tight coupling of code
* End up with duplication of code
* End up creating new bugs by fixing another bug
* End up with code which is not testable

3. ### Single Responsibility Principle

SRP says that class should have only one responsiblity and not mulitple

```c#
public class Customer
{
    void Add()
    {
        try
        {
            // Adding logic
        }
        catch (Exception ex)
        {
            FileLogger logger = new FileLogger();
            logger.Handle(ex.Message);
        }
    }
}

public class FileLogger
{
    public void Handle(string error)
    {
        File.WriteAllText(@"C:\Error.txt", error);
    }
}
```

4. ### Interface Segregation Principle

* Show only those methods to client which they need
* ISP was first used and formulated by Robert C Martin while consulting for xerox

One large Job class is segregated to multiple interfaces depending on requirement

```c#
public interface IPrintContent
{
    bool PrintContent(string content);
}

public interface IFaxContent
{
    bool FaxContent(string content);
}

public interface IPhotoCopyContent
{
    bool PhotoCopyContent(string content);
    bool ScanContent(string content);
}

public class HPPrint : IPrintContent, IFaxContent, IPhotoCopyContent
{
    public bool FaxContent(string content)
    {
        Console.WriteLine("Fax functionality");
        return true;
    }

    public bool PhotoCopyContent(string content)
    {
        Console.WriteLine("PhotoCopy functionality");
        return true;
    }

    public bool PrintContent(string content)
    {
        Console.WriteLine("Print functionality");
        return true;
    }

    public bool ScanContent(string content)
    {
        Console.WriteLine("Scan functionality");
        return true;
    }
}
```

5. ### Open closed principle

Open for Extension Closed for Modification

```c#
public class Checkout
{
    public virtual double CalculateShippingCost(double orderAmount)
    {
        return orderAmount;
    }
}

class Flipkart : Checkout
{
    public override double CalculateShippingCost(double orderAmount)
    {
        return orderAmount + (orderAmount * 0.10);
    }
}

class Amazon : Checkout
{
    public override double CalculateShippingCost(double orderAmount)
    {
        return orderAmount + (orderAmount * 0.05);
    }
}
```

6. ### Liskov substitution principle

Parent class should be able to refer child objects seamlessly during runtime polymorphism

7. ### Dependency inversion principle

High level modules should not depend on low-level modules, but should depend on abstraction

8. ### What is YAGNI 

You are not going to need it

YAGNI says- do not add any functionality until it's deemed necessary; in other words,  write the code which you need in the current situation

9. ### What is KISS 

Keep it simple 

10. ### What is DRY

Do not Repeat Yourself
