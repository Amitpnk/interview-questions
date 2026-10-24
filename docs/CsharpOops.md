# C# & OOP

## OOP concepts

### What are the pillars of OOP?

- **Abstraction** – show only what is necessary
- **Encapsulation** – hide the complexity
- **Inheritance** – reuse code through a parent–child relationship
- **Polymorphism** – one interface, many implementations

### What is the difference between abstraction and encapsulation?

| Abstraction | Encapsulation |
| --- | --- |
| Shows only what is necessary | Hides the complexity |
| Design phase | Execution (implementation) phase |

Encapsulation implements abstraction.

```csharp
public class Employee
{
    public string Name { get; set; }
    public string Address { get; set; }

    // Abstraction: the caller only needs to know about Validate()
    public void Validate()
    {
        CheckName();
        CheckAddress();
    }

    // Encapsulation: the details are hidden
    private void CheckName() { }

    private void CheckAddress() { }
}
```

### What is inheritance?

Inheritance defines a parent–child relationship, so the child class reuses (and can extend) the members of the parent class.

```csharp
public class Employee
{
    public string Name { get; set; }
}

public class Manager : Employee
{
    public int TeamSize { get; set; }
}
```

### Does C# support multiple inheritance?

Not for classes – a class can inherit from only **one** base class. A class can, however, implement **multiple interfaces**, which is how multiple inheritance is achieved in C#.

```csharp
public class HPPrinter : Printer, IFax, IScan
{
}
```

### What is polymorphism and what are its types?

Polymorphism means "many forms" – the same member behaves differently depending on the object.

- **Compile-time (static) polymorphism** – method overloading and operator overloading
- **Run-time (dynamic) polymorphism** – method overriding using `virtual` / `override`

```csharp
// Compile-time: overloading
public int Add(int a, int b) => a + b;
public double Add(double a, double b) => a + b;
```

### What are the `virtual` keyword and overriding?

The `virtual` keyword lets a parent class define logic that a child class can override.

```csharp
class BaseClass
{
    public virtual void Show()
    {
        Console.WriteLine("Base class");
    }
}

class Derived : BaseClass
{
    public override void Show()
    {
        Console.WriteLine("Derived class");
    }
}

class Program
{
    public static void Main()
    {
        BaseClass obj;

        obj = new BaseClass();
        obj.Show();

        obj = new Derived();
        obj.Show();
    }
}
```

Output:

```text
Base class
Derived class
```

### What is method hiding?

Method hiding uses the `new` keyword to hide a parent method in the child class. Unlike overriding, the method that runs depends on the **reference type**, not the object type.

```csharp
class BaseClass
{
    public void Show() => Console.WriteLine("Base class");
}

class Derived : BaseClass
{
    public new void Show() => Console.WriteLine("Derived class");
}

BaseClass obj = new Derived();
obj.Show();             // Base class
((Derived)obj).Show();  // Derived class
```

## Classes, structs and access modifiers

### What is the difference between a class and a struct?

| | Class | Struct |
| --- | --- | --- |
| Type | Reference type | Value type |
| Memory | Heap | Stack (usually) |
| Inheritance | Supported | Not supported (can implement interfaces) |
| Default value | `null` | All fields set to their defaults |
| Best for | Complex objects with behaviour | Small, immutable data (e.g. `Point`) |

### What is the difference between types and type members?

- **Types** – classes, structs, interfaces, enums and delegates
- **Type members** – the things inside a type: fields, properties, methods, constructors, events, indexers

### What is the difference between a static class and an instance class?

- A **static class** cannot be instantiated, can contain only static members and is sealed. Its members are accessed through the class name, e.g. `Math.Max(1, 2)`.
- An **instance class** must be created with `new`, and each object has its own copy of the instance fields.

### What is the access modifier of the default constructor in C#?

`public`

```csharp
public class Customer
{
    // The compiler generates: public Customer() { }
}
```

### What is the `protected internal` access modifier?

A `protected internal` member is accessible from **anywhere in the same assembly**, and from **derived classes in other assemblies**.

| Modifier | Same class | Derived class (same assembly) | Other class (same assembly) | Derived class (other assembly) | Other class (other assembly) |
| --- | --- | --- | --- | --- | --- |
| `private` | Yes | | | | |
| `protected` | Yes | Yes | | Yes | |
| `internal` | Yes | Yes | Yes | | |
| `protected internal` | Yes | Yes | Yes | Yes | |
| `private protected` | Yes | Yes | | | |
| `public` | Yes | Yes | Yes | Yes | Yes |

### Can we create a private class?

No, unless it is a **nested** class.

```csharp
public class Class1
{
    private readonly Temp _temp;

    public Class1()
    {
        _temp = new Temp();
    }

    private class Temp
    {
        private string str;

        public string GetStr()
        {
            return str;
        }
    }
}
```

### Why do we need a private constructor?

- To prevent a class from being inherited
- To prevent a class from being instantiated, or to stop multiple instances being created
- To implement the Singleton design pattern

```csharp
public class TestPrivateConstructor
{
    private TestPrivateConstructor()
    { }

    public static int Sum(int a, int b)
    {
        return a + b;
    }
}

class Program
{
    static void Main(string[] args)
    {
        // Call the static method through the class name
        int result = TestPrivateConstructor.Sum(10, 15);

        // TestPrivateConstructor obj = new TestPrivateConstructor();
        // Compile error: the constructor is inaccessible
    }
}
```

### What is a sealed class?

A sealed class cannot be inherited.

```csharp
sealed class ClassName
{
    // data members
    // methods
}
```

## Abstract classes and interfaces

### Why use an abstract class?

When we want to move common functionality of two or more related classes into a base class, and we don't want the base class to be instantiated.

```csharp
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

    ContractEmployee contractEmployee = new ContractEmployee()
    {
        Id = 102,
        FirstName = "John",
        LastName = "Doe",
        HourlyPay = 40000,
        TotalHours = 40
    };

    Console.WriteLine(contractEmployee.GetFullName());
    Console.WriteLine(contractEmployee.GetMonthlySalary());
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

    public abstract int GetMonthlySalary();
}

public class FullTimeEmployee : BaseEmployee
{
    public int AnnualSalary { get; set; }

    public override int GetMonthlySalary()
    {
        return AnnualSalary / 12;
    }
}

public class ContractEmployee : BaseEmployee
{
    public int HourlyPay { get; set; }
    public int TotalHours { get; set; }

    public override int GetMonthlySalary()
    {
        return TotalHours * HourlyPay;
    }
}
```

### What are the advantages of using interfaces?

- Interfaces allow us to develop decoupled systems
- Interfaces are very useful for dependency injection
- Interfaces make unit testing and mocking easy

### What is the difference between an abstract class and an interface?

| | Abstract class | Interface |
| --- | --- | --- |
| Implementation | Can have implemented and abstract members | Only declarations (default implementations allowed from C# 8) |
| Fields | Can have fields | Cannot have instance fields |
| Constructor | Can have a constructor | Cannot have a constructor |
| Access modifiers | Members can have any access modifier | Members are public by default |
| Inheritance | A class can inherit only one abstract class | A class can implement many interfaces |
| Use when | Related classes share common code | Unrelated classes share a contract |

### Can an abstract class have a constructor?

Yes. Use it to initialise fields of the abstract class before the child class is instantiated.

**You cannot create an instance of an abstract class, so what is the use of its constructor?**

Although we cannot create an instance of an abstract class, we can create instances of a derived class, and the parent abstract class constructor is called automatically.

> **Note:** Because the abstract class constructor only runs through a derived class, it is good practice to mark it `protected`. Making it `public` doesn't make sense.

### Can you call an abstract method from an abstract class constructor?

Yes.

**An abstract method has no implementation, so what is the use of calling it from the constructor?**

When you want the abstract method to be invoked automatically whenever an instance of a derived class is created.

### An abstract class has a default implementation for a method. The default is needed in some derived classes but not in others. How can you achieve this?

Make the method `virtual` in the abstract class, and override it only where needed.

```csharp
public abstract class AbstractClass
{
    public virtual void AbstractClassMethod()
    {
        Console.WriteLine("Default implementation");
    }
}

public class SomeClass : AbstractClass
{
}

public class SomeOtherClass : AbstractClass
{
    public override void AbstractClassMethod()
    {
        Console.WriteLine("New implementation");
    }
}
```

## Arrays and collections

### What is an array?

An array is a collection of elements of the same data type.

- **Advantage:** arrays are strongly typed
- **Disadvantage:** an array cannot grow in size once initialised

```csharp
int[] val = new int[3];
val[0] = 11;
val[1] = 12;

int[] val2 = { 1, 2, 3 };
```

### Can you store different types in an array in C#?

Yes, by using an `object` array or an `ArrayList`.

Example 1 – `object` array:

```csharp
class Program
{
    static void Main()
    {
        object[] objectArray = new object[3];
        objectArray[0] = 101;  // integer
        objectArray[1] = "C#"; // string

        Customer c = new Customer();
        c.ID = 99;
        c.Name = "Pragim";

        objectArray[2] = c;    // Customer - complex type

        // Loop through the array and retrieve the items
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

Example 2 – `ArrayList`:

```csharp
class Program
{
    static void Main()
    {
        System.Collections.ArrayList arrayList = new System.Collections.ArrayList();
        arrayList.Add(101);  // integer
        arrayList.Add("C#"); // string

        Customer c = new Customer();
        c.ID = 99;
        c.Name = "Pragim";

        arrayList.Add(c);    // Customer - complex type

        // Loop through the list and retrieve the items
        foreach (object obj in arrayList)
        {
            Console.WriteLine(obj);
        }
    }
}
```

### What is a jagged array?

A jagged array is an array of arrays, where each inner array can have a different length.

```csharp
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
        jaggedArray[2][1] = "Master";

        for (int i = 0; i < jaggedArray.Length; i++)
        {
            Console.WriteLine(employeeNames[i]);
            Console.WriteLine("------------");

            string[] innerArray = jaggedArray[i];
            for (int j = 0; j < innerArray.Length; j++)
            {
                Console.WriteLine(innerArray[j]);
            }
        }
    }
}
```

### Can you store different list types in a single generic list?

Yes, by creating a list of lists of objects.

```csharp
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

## Types and keywords

### What is the difference between `int` and `Int32`?

There is no difference – both create a 32-bit integer. `int` is the C# alias for `System.Int32`.

The only difference is that `Int32` needs the `System` namespace:

```csharp
using System;
```

### What is the difference between `string` and `String`?

There is no difference – `string` is the C# alias for `System.String`. By convention, use `string` for declarations and `String` when calling static methods (e.g. `String.Join`), although either works.

### What is a nullable type? What is the difference between `?` and `??`?

By default, all reference types (such as `String`) are nullable, but value types (such as `Int32`) are not.

- **Nullable type (`?`)** – makes a value type nullable, e.g. `int? i = null;`
- **Null-coalescing operator (`??`)** – returns the left operand if it is not null, otherwise the right operand

With the null-coalescing operator:

```csharp
int? ticketsOnSale = null;

int availableTickets = ticketsOnSale ?? 0;

Console.WriteLine(availableTickets);
```

Without the null-coalescing operator:

```csharp
int? ticketsOnSale = null;

int availableTickets;

if (ticketsOnSale == null)
{
    availableTickets = 0;
}
else
{
    availableTickets = ticketsOnSale.Value;
}

Console.WriteLine(availableTickets);
```

### What is the difference between `Parse` and `TryParse`?

- `Parse()` throws an exception if it cannot parse the value
- `TryParse()` returns a `bool` indicating whether it succeeded, and returns the value through an `out` parameter

```csharp
string strNumber = "100GB";

bool success = int.TryParse(strNumber, out int result);

Console.WriteLine(success); // False
Console.WriteLine(result);  // 0
```

### What is the difference between `is` and `as`?

- `is` checks whether an object is compatible with a type and returns a `bool`
- `as` tries to cast an object to a type and returns `null` instead of throwing if the cast fails (reference and nullable types only)

```csharp
object obj = "Hello";

if (obj is string)
{
    Console.WriteLine("obj is a string");
}

string str = obj as string;   // "Hello"
Customer c = obj as Customer; // null, no exception
```

## Exceptions

### What is the difference between `throw` and `throw ex`?

**`throw`** keeps the complete stack trace from where the original error occurred. Use it in your own applications.

**`throw ex`** resets the stack trace to the point where `throw ex` is called. It is sometimes used in a library (for example, one published on NuGet) that doesn't want to expose its full stack trace.

```csharp
static void Main(string[] args)
{
    try
    {
        ThrowException1(); // line 19
    }
    catch (Exception x)
    {
        Console.WriteLine("Exception 1:");
        Console.WriteLine(x.StackTrace);
    }

    try
    {
        ThrowException2(); // line 25
    }
    catch (Exception x)
    {
        Console.WriteLine("Exception 2:");
        Console.WriteLine(x.StackTrace);
    }
}

private static void ThrowException1()
{
    try
    {
        DivByZero(); // line 34
    }
    catch
    {
        throw; // line 36
    }
}

private static void ThrowException2()
{
    try
    {
        DivByZero(); // line 41
    }
    catch (Exception ex)
    {
        throw ex; // line 43
    }
}

private static void DivByZero()
{
    int x = 0;
    int y = 1 / x; // line 49
}
```

Output:

```text
Exception 1:
   at UnitTester.Program.DivByZero() in <snip>\Dev\UnitTester\Program.cs:line 49
   at UnitTester.Program.ThrowException1() in <snip>\Dev\UnitTester\Program.cs:line 36
   at UnitTester.Program.TestExceptions() in <snip>\Dev\UnitTester\Program.cs:line 19

Exception 2:
   at UnitTester.Program.ThrowException2() in <snip>\Dev\UnitTester\Program.cs:line 43
   at UnitTester.Program.TestExceptions() in <snip>\Dev\UnitTester\Program.cs:line 25
```

### What happens if a `finally` block throws an exception? How do you handle it?

- Execution of the `finally` block stops at the point where the exception is thrown
- The exception should be handled at a higher level (for example, a global exception handler)

## Functions, delegates and async

### What is a recursive function?

A recursive function is a function that calls itself. Examples:

- Finding the factorial of a number
- Finding a file inside a directory tree

```text
4! = 4 * 3 * 2 * 1 = 24
```

```csharp
static void Main()
{
    double factorial = Factorial(4);
    Console.WriteLine(factorial); // 24
}

public static double Factorial(int number)
{
    if (number == 0)
    {
        return 1;
    }

    return number * Factorial(number - 1);
}
```

### What is a lambda expression?

A lambda expression is a short way to write an anonymous function, using the `=>` operator.

```csharp
Func<int, int> square = x => x * x;
Console.WriteLine(square(5)); // 25

var evens = numbers.Where(n => n % 2 == 0);
```

### What are `Func`, `Action` and `Predicate` delegates?

They are built-in generic delegates, so you don't have to declare your own delegate types.

- **`Func<T, TResult>`** – takes up to 16 parameters and **returns** a value (the last type argument is the return type)
- **`Action<T>`** – takes up to 16 parameters and returns `void`
- **`Predicate<T>`** – takes one parameter and returns `bool`

```csharp
Func<int, int, int> add = (a, b) => a + b;
Action<string> log = message => Console.WriteLine(message);
Predicate<int> isEven = n => n % 2 == 0;

log(add(2, 3).ToString()); // 5
```

### What are `async` and `await`?

`async` and `await` let you write asynchronous code that reads like synchronous code. `await` frees the current thread while a long-running operation (I/O, HTTP call, database query) completes, instead of blocking it.

```csharp
public async Task<string> GetPageAsync(string url)
{
    using var client = new HttpClient();
    string content = await client.GetStringAsync(url);
    return content;
}
```

## Attributes and reflection

### What are attributes?

Attributes add declarative metadata to code (classes, methods, properties, etc.), which can be read at run time using reflection.

```csharp
[Obsolete("Use NewMethod instead")]
public void OldMethod() { }

public class Customer
{
    [Required]
    public string Name { get; set; }
}
```

### What is reflection?

Reflection lets code inspect the metadata of types at run time – for example, to list the properties and methods of a class, read attributes or create objects dynamically.

```csharp
Type type = typeof(Customer);

foreach (PropertyInfo property in type.GetProperties())
{
    Console.WriteLine(property.Name);
}

object customer = Activator.CreateInstance(type);
```
