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

## What is Design principle?

* Design principle enable us manage most of software design problems
* SOLID Principles are subset of many principles promoted by Uncle Bob (Robert C Martin)

Different types of design principle
* SOLID
* YAGNI
* KISS
* DRY

## What if we don't follow SOLID principles
 
* End up with tight coupling of code
* End up with duplication of code
* End up creating new bugs by fixing another bug
* End up with code which is not testable

## Single Responsibility Principle

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

## Open closed principle

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

## Liskov substitution principle

Parent class should be able to refer child objects seamlessly during runtime polymorphism

```c#
interface IPaymentTransaction  
{  
    void ProcessTransaction();  
}  
  
interface IPaymentCheckBalance  
{  
    void CheckBalance();  
    void DeductAmount();  
}  
  
class Paypal : IPaymentTransaction, IPaymentCheckBalance  
{  
    public void CheckBalance()  
    {  
        Console.WriteLine("CheckBalance Method Called");  
    }  
  
    public void DeductAmount()  
    {  
        Console.WriteLine("DeductAmount Method Called");  
    }  
  
    public   void ProcessTransaction()  
    {  
        Console.WriteLine("ProcessTransaction Method Called");  
    }  
}  
  
class COD : IPaymentTransaction  
{  
    public   void ProcessTransaction()  
    {  
        Console.WriteLine("ProcessTransaction Method Called");  
    }  
} 
```

## Interface Segregation Principle

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

## Dependency inversion principle

High level modules should not depend on low-level modules, but should depend on abstraction

```c#
public class Customer  
{  
    private IErrorHandling _errorHandling;  
    public Customer(IErrorHandling errorHandling)  
    {  
        _errorHandling = errorHandling;  
    }  
    public void Add()  
    {  
        try  
        {  
            // TODO: Calling Add method DAL
        }  
        catch (Exception ex)  
        {  
            _errorHandling.Handle(ex.Message);  
        }  
    }  
}  

public interface IErrorHandling  
{  
    void Handle(string error);  
}  
public class FileLogger : IErrorHandling  
{  
    public void Handle(string error)  
    {  
        Console.WriteLine("file log");  
    }  
}  

public class EmailLogger : IErrorHandling  
{  
    public void Handle(string error)  
    {  
        Console.WriteLine("inserting to db");  
    }  
}  

```

## What is YAGNI 

You are not going to need it

YAGNI says- do not add any functionality until it's deemed necessary; in other words,  write the code which you need in the current situation

## What is KISS 

Keep it simple 

## What is DRY

Do not Repeat Yourself
