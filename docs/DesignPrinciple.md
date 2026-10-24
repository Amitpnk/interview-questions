# Design Principles

## Overview

### What are design principles?

- Design principles help us manage most software design problems
- The SOLID principles are a subset of the many principles promoted by Uncle Bob (Robert C. Martin)

Common design principles:

- SOLID
- YAGNI
- KISS
- DRY

### What happens if we don't follow the SOLID principles?

- Tightly coupled code
- Duplicated code
- New bugs created while fixing other bugs
- Code that is not testable

## SOLID

| Letter | Principle | One line |
| --- | --- | --- |
| S | Single Responsibility | A class should have only one reason to change |
| O | Open/Closed | Open for extension, closed for modification |
| L | Liskov Substitution | A child class must be usable wherever its parent is |
| I | Interface Segregation | Don't force clients to depend on methods they don't use |
| D | Dependency Inversion | Depend on abstractions, not concrete classes |

### What is the Single Responsibility Principle (SRP)?

A class should have only one responsibility, not several.

In the example below, logging is moved out of `Customer` into its own `FileLogger` class, so `Customer` is only responsible for customer logic.

```csharp
public class Customer
{
    public void Add()
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

### What is the Open/Closed Principle (OCP)?

A class should be **open for extension** but **closed for modification**. New behaviour is added by extending the class, not by changing it.

```csharp
public class Checkout
{
    public virtual double CalculateShippingCost(double orderAmount)
    {
        return orderAmount;
    }
}

public class Flipkart : Checkout
{
    public override double CalculateShippingCost(double orderAmount)
    {
        return orderAmount + (orderAmount * 0.10);
    }
}

public class Amazon : Checkout
{
    public override double CalculateShippingCost(double orderAmount)
    {
        return orderAmount + (orderAmount * 0.05);
    }
}
```

### What is the Liskov Substitution Principle (LSP)?

A parent class reference should be able to refer to child objects seamlessly at run time, without breaking the program.

If `COD` (cash on delivery) were forced to implement `CheckBalance()`, it would have to throw `NotImplementedException`, and code using the parent type would break. Splitting the contract means every class can be substituted safely for the interfaces it implements.

```csharp
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
        Console.WriteLine("CheckBalance method called");
    }

    public void DeductAmount()
    {
        Console.WriteLine("DeductAmount method called");
    }

    public void ProcessTransaction()
    {
        Console.WriteLine("ProcessTransaction method called");
    }
}

class COD : IPaymentTransaction
{
    public void ProcessTransaction()
    {
        Console.WriteLine("ProcessTransaction method called");
    }
}
```

### What is the Interface Segregation Principle (ISP)?

- Show clients only the methods they need
- ISP was first formulated by Robert C. Martin while consulting for Xerox

One large "job" interface is split into several smaller interfaces, depending on the requirement:

```csharp
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

### What is the Dependency Inversion Principle (DIP)?

High-level modules should not depend on low-level modules; both should depend on abstractions.

```csharp
public class Customer
{
    private readonly IErrorHandling _errorHandling;

    public Customer(IErrorHandling errorHandling)
    {
        _errorHandling = errorHandling;
    }

    public void Add()
    {
        try
        {
            // TODO: call the Add method in the DAL
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
        Console.WriteLine("Logging to file");
    }
}

public class EmailLogger : IErrorHandling
{
    public void Handle(string error)
    {
        Console.WriteLine("Sending error email");
    }
}
```

## Other principles

### What is YAGNI?

**You Aren't Gonna Need It.** Don't add functionality until it is necessary – write only the code you need for the current situation.

### What is KISS?

**Keep It Simple, Stupid.** Prefer the simplest solution that works; avoid unnecessary complexity.

### What is DRY?

**Don't Repeat Yourself.** Every piece of logic should exist in one place, so that a change only has to be made once.
