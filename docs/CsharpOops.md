# C# and Oops concept

## Can you store different types in an array in c#?

Yes, we care create by using an object array and ArrayList

Example 1:

```c#
class Program
{
    static void Main()
    {
        object[] objectArray = new object[3];
        objectArray[0] = 101; // integer
        objectArray[1] = "C#"; // string

        Customer c = new Customer();
        c.ID = 99;
        c.Name = "Pragim";

        objectArray[2] = c; // Customer - Complext Type 

        // loop thru the array and retrieve the items
        foreach (object obj in objectArray)
        {
            Console.WriteLine(obj);
        }
    }
}

class Customer
{
    public int ID { get; set; }
    public string Name { get; set; }

    public override string ToString()
    {
        return this.Name;
    }
}
```

Example 2:

```c#
class Program
{
    static void Main()
    {
        System.Collections.ArrayList arrayList = new System.Collections.ArrayList();
        arrayList.Add(101); // integer
        arrayList.Add("C#"); // integer

        Customer c = new Customer();
        c.ID = 99;
        c.Name = "Pragim";

        arrayList.Add(c); // Customer - Complext Type 

        // loop thru the array and retrieve the items
        foreach (object obj in arrayList)
        {
            Console.WriteLine(obj);
        }
    }
}
```

## What is jagged array?

A jagged array is an array of arrays.

```c#
class Program
{
    static void Main()
    {
        string[] employeeNames = new string[3];
        employeeNames[0] = "Mark";
        employeeNames[1] = "Matt";
        employeeNames[2] = "John";

        string[][] jaggedArray = new string[3][];
        
        jaggedArray[0] = new string[3];
        jaggedArray[1] = new string[1];
        jaggedArray[2] = new string[2];
        
        jaggedArray[0][0] = "Bachelor";
        jaggedArray[0][1] = "Master";
        jaggedArray[0][2] = "Doctorate";

        jaggedArray[1][0] = "Bachelor";

        jaggedArray[2][0] = "Bachelor";
        jaggedArray[2][0] = "Master";

        for(int i=0; i< jaggedArray.Length; i++)
        {
            Console.WriteLine(employeeNames[i]);
            Console.WriteLine("------------");

            string[] innerArray = jaggedArray[i];
            for(int j=0; j< innerArray.Length; j++))
            {
                Console.WriteLine(innerArray[j]);
            }
        }
    }
}
```

## Why use abstract class

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

## What is advantage of using interfaces?

* Interfaces allow us to develop decoupled system
* Interfaces are very useful for Dependency Injection
* Interfaces make unit testing and mocking easy

## What is recursive function

A recursive function is a function that calls itself

Example
* used in finding factorial 
* find file inside filedirectory

Code snippet for Factorial:
```
4! = 4 * 3 * 2 * 1 = 24
4! = 4 * (4-1) * (4-2) * (4-3) = 24
```

```c#
static void Main()
{
    double facotrial = Facotrial(number);
    Console.WriteLine(facotrial);
}

public static double Factorial(int number)
{
    if (number==0)
    {
        return 1;
    }

    return number * Factorial(number - 1);
}
```

## Storing different list types in a single generic list?

Yes, by creating list of list of objects

```c#
    List<List<object>> lists = new List<List<object>>();

    List<object> list1 = new List<object>();
    list1.Add(101);
    list1.Add(102);
    list1.Add(103);

    lists.Add(list1);

    List<object> list2 = new List<object>();
    list2.Add("Test1");
    list2.Add("Test2");
    list2.Add("Test3");

    lists.Add(list2);

    foreach (var item in lists)
    {
        foreach (var obj in item)
        {
            Console.WriteLine(obj);
        }
    }

```

## Can an abstract class have a constructor?

Yes, an abstract class can have constructor. If you want to initialise certain fields of abstract class before the instantiation of child-class takes place.

### You cannot create an instance of an abstract class. So, what is use of constructor in an abstract class?

though we cannot create an instance of an abstract class, we can create instances of derived class. hence parent abstract class constructor is automatically called.

Note: Abstract classes can't be directly instantiated. The abstract class constructor gets executed thourgh derived class. So, it is good practice to use protected access modifier with abstract class constructor. using public doesn't make sense

## Can you call an abstract method from an abstract class constructor?

yes

### An abstract method in an abstract class does not have any implemention, so what is the use of calling it from abstract class constructor?

If you want abstract method to be invoked automatically whenevver an instance of derived class of abstract class is created

## What happens if finally block throws an exception

### How to handle exceptions that occur in finally block?

* Should be handled at higher level (Global level)
* Finally block execution stops at point where exception is thrown

## Difference between is and as in C#

TODO

## Can we use private class

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

## Difference between string and String in C#

## Difference between int and Int32 in C#

Int32 and int are same, both of them allow us to create a 32 bit integer. int is alias for Int32

only difference is for Int32 we need namespace.

```c#
using System;
```

## An abstract class has default implementation for method. The method's default implementation is needed in some class but not in some other class. How can you achieve it?

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

## What is access modifier of default constructor in c#

public

```c#
public class Customer
{
   
}
```

## What is nullable type? difference between ? (nullable type) and ?? (Null Coalescing Operator)

nullable type
By default, all reference types, such as String, are nullable, but all value types, such as Int32, are not.

To make value type as nullable we use this operator


Null Coalescing Operator (??)


```c#
int? ticketOnSale = null;

int availableTickets;

availableTickets = ticketOnSale ?? 0;

Console.WriteLine(availableTickets);
```

without Null Coalescing Operator (??)

```c#
int? ticketOnSale = null;

int availableTickets;

if (ticketOnSale == null)
{
    availableTickets = 0;
}
else
{
    availableTickets = ticketOnSale.Value;
}

Console.WriteLine(availableTickets);
```

## Difference between Parse and TryParse

Parse() method throws an exception if it cannot parse value
TryParse() retruns bool indicating whether it succeeded or failed

```C#
string strNumber = "100GB";

int Result;

int.TryParse(strNumber,out Result);

Console.WriteLine(Result);
```

## What is Arrays?

An array is collectioon of similar data types.

Advantages: Arrays are strongly typed

Disadvantages: Array cannot grow in size once initiazed

```c#
int[] val = new int[3];
val[0] = 11;
val[0] = 12;

int[] val2 = {1,2,3};

```

## static class and instance

## What are pillar of OOPS concept

* Inheritance
* Encapsulation
* Abstraction
* Polymorphism



## Method hiding

## Polymorphism and different types of it

## Difference between Class and Struct 

## Difference between abstract and interface

## Multple class in inheritence

## Difference between Types and Type members

## Protected internal Access modifiers

## Attributes

## Reflection

## Aync and await 

## Func delegates

## Lambda expression

## Difference between Abstraction and Encapsulation

Abstraction - Show only whats necessary (Design phase)
Encapsulation - Hide complexity (Execution phase)

Encapsulation implements Abstraction

```c#
public class Employee
{
    public string Name {get; set;}
    public string Address {get; set;}
    public void Validate()
    {
        CheckName();
        CheckAddress();
    }

    // Implement encapsulation
    private void CheckName()
    {

    }
    
    private void CheckAddress()
    {
        
    }
}
```

## Inheritence

Defines parent child relationship

## virtual keyword and overriding

Virtual keyword helps us to define some logic in parent class which can be overridden in the child class

```c#
class baseClass 
{
    public virtual void show()
    {
        Console.WriteLine("Base class");
    }
}
 
class derived : baseClass
{
    public override void show()
    {
        Console.WriteLine("Derived class");
    }
}
 
class Program {
    public static void Main()
    {
        baseClass obj;
 
        obj = new baseClass();
        obj.show();

        obj = new derived();
        obj.show();
    }
}
```

output
```ps1
Base class
Derived class
```

## throw and throw ex

<b>throw</b> 

Throw maintains complete error stack trace from where original error originated 

For our internal application

<b>throw ex</b> 

Throw ex resets error stack trace from where original error originated 

If we having library which is published in nuget, which we don't want to expose complete stack trace then Throw ex is used

```c#
static void Main(string[] args) {
    try {
        ThrowException1(); // line 19
    } catch (Exception x) {
        Console.WriteLine("Exception 1:");
        Console.WriteLine(x.StackTrace);
    }
    try {
        ThrowException2(); // line 25
    } catch (Exception x) {
        Console.WriteLine("Exception 2:");
        Console.WriteLine(x.StackTrace);
    }
}

private static void ThrowException1() {
    try {
        DivByZero(); // line 34
    } catch {
        throw; // line 36
    }
}
private static void ThrowException2() {
    try {
        DivByZero(); // line 41
    } catch (Exception ex) {
        throw ex; // line 43
    }
}

private static void DivByZero() {
    int x = 0;
    int y = 1 / x; // line 49
}

```

Output
```ps1
Exception 1:
   at UnitTester.Program.DivByZero() in <snip>\Dev\UnitTester\Program.cs:line 49
   at UnitTester.Program.ThrowException1() in <snip>\Dev\UnitTester\Program.cs:line 36
   at UnitTester.Program.TestExceptions() in <snip>\Dev\UnitTester\Program.cs:line 19

Exception 2:
   at UnitTester.Program.ThrowException2() in <snip>\Dev\UnitTester\Program.cs:line 43
   at UnitTester.Program.TestExceptions() in <snip>\Dev\UnitTester\Program.cs:line 25
```

## Why do we need private constructor?

* To restrict a class being inherited.
* Restrict a class being instantiate or creating multiple instance/object.
* To achieve the singleton design pattern.

```c#
public class TestPrivateConstructor
{
    private TestPrivateConstructor()
    {  }

    public static int sum(int a , int b)
    {
        return a + b;
    }
}

class Program
{
    static void Main(string[] args)
    {
        // calling the private constructor using class name directly 
        int result = TestPrivateConstructor.sum(10, 15);
        
        // TestPrivateConstructor objClass = new TestPrivateConstructor(); 
        // Will throw the error. We can't create object of this class
    }
}
```

## Sealed Class

Sealed classes are used to restrict the users from inheriting the class

```c#
sealed class class_name
{
    // data members
    // methods
}
```
