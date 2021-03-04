# C# Interview Questions & Answers

### Table of Contents

| No. | Questions |
| --- | --------- |
||**c# and OOPS**|
|1  | [Can you store different types in an array in c#?](#can-you-store-different-types-in-an-array-in-c#?) |
|2  | [What is jagged array?](#what-is-jagged-array) |
|3  | [Why use abstract class? Should we design it as abstract class or concrete (non abstract) class?](#why-use-abstract-class)  |
|4  | [Why use interfaces? What is advantage of using interfaces?](#what-is-advantage-of-using-interfaces?) |
|5  | [What is recursive function?](#what-is-recursive-function?) |
|6  | [Storing different list types in a single generic list?](#storing-different-list-types-in-a-single-generic-list?) |
|7  | [Can an abstract class have a constructor? You cannot create an instance of an abstract class. So, what is use of constructor in an abstract class?](#can-an-abstract-class-have-a-constructor?) |
|8  | [Can you call an abstract method from an abstract class constructor?](#can-you-call-an-abstract-method-from-an-abstract-class-constructor?)|
|9  | [What happens if finally block throws an exception? How to handle exceptions that occur in finally block](#what-happens-if-finally-block-throws-an-exception?)|


1. ### Can you store different types in an array in c#?

Yes, we care create by using an object array and ArrayList

#### Example 1:

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

#### Example 2:

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

**[⬆ Back to Top](#table-of-contents)**

2. ### What is jagged array?

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

**[⬆ Back to Top](#table-of-contents)**

3. ### Why use abstract class

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

4. ### What is advantage of using interfaces?

* Interfaces allow us to develop decoupled system
* Interfaces are very useful for Dependency Injection
* Interfaces make unit testing and mocking easy

5. ### What is recursive function

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

6. ### Storing different list types in a single generic list?

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

7. ### Can an abstract class have a constructor?

Yes, an abstract class can have constructor. If you want to initialise certain fields of abstract class before the instantiation of child-class takes place.

#### You cannot create an instance of an abstract class. So, what is use of constructor in an abstract class?

though we cannot create an instance of an abstract class, we can create instances of derived class. hence parent abstract class constructor is automatically called.

Note: Abstract classes can't be directly instantiated. The abstract class constructor gets executed thourgh derived class. So, it is good practice to use protected access modifier with abstract class constructor. using public doesn't make sense

8. ### Can you call an abstract method from an abstract class constructor?

yes

#### An abstract method in an abstract class does not have any implemention, so what is the use of calling it from abstract class constructor?

If you want abstract method to be invoked automatically whenevver an instance of derived class of abstract class is created

9. ### What happens if finally block throws an exception

#### How to handle exceptions that occur in finally block?

* Should be handled at higher level (Global level)
* Finally block execution stops at point where exception is thrown

10. ### Difference between is and as in C#

TODO

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

12. ### Difference between string and String in C#

13. ### Difference between int and Int32 in C#

Int32 and int are same, both of them allow us to create a 32 bit integer. int is alias for Int32

only difference is for Int32 we need namespace.

```c#
using System;
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

16. ### 