# Object oriented programming

## Table of Contents

| No. | Questions |
| --- | --------- |
||**OOPS**|
|1  | [Can you store different types in an array in c#?](#can-you-store-different-types-in-an-array-in-c#?) |
|2  | [What is jagged array?](#what-is-jagged-array) |
|3  | [Why use abstract class? Should we design it as abstract class or concrete (non abstract) class?](#why-use-abstract-class)  |
|4  | [Why use interfaces? What is advantage of using interfaces?](#what-is-advantage-of-using-interfaces?) |
|5  | [What is recursive function?](#what-is-recursive-function?) |
|6  | [Storing different list types in a single generic list?](#storing-different-list-types-in-a-single-generic-list?) |
|7  | [Can an abstract class have a constructor? You cannot create an instance of an abstract class. So, what is use of constructor in an abstract class?](#can-an-abstract-class-have-a-constructor?) |
|8  | [Can you call an abstract method from an abstract class constructor?](#can-you-call-an-abstract-method-from-an-abstract-class-constructor?)|
|9  | [What happens if finally block throws an exception? How to handle exceptions that occur in finally block](#what-happens-if-finally-block-throws-an-exception?)|

1. ### Why use abstract class

When we want to move common functionality of 2 or more related classes into a base class and when we don't want base class to be instantiated

```c#
static void Main(string[] args)
{

    FullTimeEmployee fullTimeEmployee = new FullTimeEmployee()
    {
        Id = 101,
        FirstName = "Mark",
        LastName = "May",
        AnnualSalary = 3500000
    };

    Console.WriteLine(fullTimeEmployee.GetFullName());
    Console.WriteLine(fullTimeEmployee.GetMonthlySalary());

    Console.WriteLine("Hello World!");

    ContractEmployee contractEmployee = new ContractEmployee()
    {
        Id = 101,
        FirstName = "Mark",
        LastName = "May",
        HourlyPay = 40000,
        TotalHours = 40
    };

    contractEmployee.GetFullName();
    contractEmployee.GetMonthlySalary();
}

public abstract class BaseEmployee
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string GetFullName()
    {
        return FirstName + " " + LastName;
    }
}

public class FullTimeEmployee : BaseEmployee
{
    public int AnnualSalary { get; set; }

    public int GetMonthlySalary()
    {
        return AnnualSalary / 12;
    }
}

public class ContractEmployee : BaseEmployee
{
    public int HourlyPay { get; set; }
    public int TotalHours { get; set; }

    public int GetMonthlySalary()
    {
        return TotalHours * HourlyPay;
    }
}
```

2. ### What is advantage of using interfaces?

* Interfaces allow us to develop decoupled system
* Interfaces are very useful for Dependency Injection
* Interfaces make unit testing and mocking easy

7. ### Can an abstract class have a constructor?

Yes, an abstract class can have constructor. If you want to initialise certain fields of abstract class before the instantiation of child-class takes place.

#### You cannot create an instance of an abstract class. So, what is use of constructor in an abstract class?

though we cannot create an instance of an abstract class, we can create instances of derived class. hence parent abstract class constructor is automatically called.

Note: Abstract classes can't be directly instantiated. The abstract class constructor gets executed thourgh derived class. So, it is good practice to use protected access modifier with abstract class constructor. using public doesn't make sense

8. ### Can you call an abstract method from an abstract class constructor?

yes

#### An abstract method in an abstract class does not have any implemention, so what is the use of calling it from abstract class constructor?

If you want abstract method to be invoked automatically whenevver an instance of derived class of abstract class is created

11. ### Can we use private class

NO. Nothing unless its in a nested Class

```c#
public class Class1
{
    temp _temp ;
    public Class1()
    {
        _temp = new temp();   
    }    

    private class temp
    {
        string str;
        public string GetStr()
        {
        return str;
        }

    }
}
```

14. ### An abstract class has default implementation for method. The method's default implementation is needed in some class but not in some other class. How can you achieve it? 

By achieving virtual method in Abstract class

```c#
public abstract class AbstractClass
{
    public virtual void AbstractClassMethod()
    {
        Console.WriteLine("Default implementation");
    }
}

public class SomeClass: AbstractClass
{

}

public class SomeOtherClass : AbstractClass
{
    public override void AbstractClassMethod()
    {
        Console.WriteLine("new implementation");
    }
}
```

15. ### What is access modifier of default constructor in c#

public

```c#
public class Customer
{
   
}
```

19. ### static class and instance

### What are pillar of OOPS concept

* Inheritance
* Encapsulation
* Abstraction
* Polymorphism

20. ### Inheritence

21. ### Method hiding

22. ### Polymorphism and different types of it

23. ### Difference between Class and Struct 

24. ### Interface and difference between explicit and implicit

25. ### Difference between abstract and interface

26. ### Multple class in inheritence

27. ### Delegates and it's usage

28. ### Multicast delegates

29. ### Difference between Types and Type members

30. ### Protected internal Access modifiers

31. ### Attributes

32. ### Reflection

33. ### Aync and await 

34. ### Func delegates

35. ### Lambda expression

36. ### Difference between ref and out?

TODO

