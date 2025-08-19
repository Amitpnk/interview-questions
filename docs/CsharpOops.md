# C# and OOP Concepts – Interview Questions

## Can you store different types in an array in C#?

Yes. This can be achieved using **object arrays** or **ArrayList**.

### Example 1 – Using `object[]`

```csharp
class Program
{
    static void Main()
    {
        object[] objectArray = new object[3];
        objectArray[0] = 101;          // int
        objectArray[1] = "C#";         // string
        objectArray[2] = new Customer { ID = 99, Name = "Pragim" }; // custom type

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

    public override string ToString() => this.Name;
}
```

### Example 2 – Using `ArrayList`

```csharp
System.Collections.ArrayList arrayList = new System.Collections.ArrayList();
arrayList.Add(101);
arrayList.Add("C#");
arrayList.Add(new Customer { ID = 99, Name = "Pragim" });

foreach (object obj in arrayList)
{
    Console.WriteLine(obj);
}
```

**Note:** Best practice is to prefer **generics** (`List<T>`) over `ArrayList`.

---

## What is a jagged array?

A **jagged array** is an array of arrays where inner arrays can have different lengths.

```csharp
string[][] jaggedArray = new string[3][];
jaggedArray[0] = new string[] { "Bachelor", "Master", "Doctorate" };
jaggedArray[1] = new string[] { "Bachelor" };
jaggedArray[2] = new string[] { "Bachelor", "Master" };
```

---

## Why use an abstract class?

* Move common functionality of related classes into a base class.
* Prevent base class instantiation.
* Support **code reusability** and **polymorphism**.

---

## What is the advantage of using interfaces?

* Enables decoupled system design.
* Supports **Dependency Injection**.
* Facilitates **unit testing and mocking**.

---

## What is a recursive function?

A recursive function is one that calls itself.

Example: Factorial

```csharp
public static double Factorial(int number)
{
    if (number == 0) return 1;
    return number * Factorial(number - 1);
}
```

---

## Can an abstract class have a constructor?

Yes. It is used to initialize base class members before child instantiation.
Best practice: mark it as `protected`.

---

## Can you call an abstract method from an abstract class constructor?

Yes. The derived class implementation is executed automatically upon instantiation.

---

## What happens if `finally` block throws an exception?

* The exception propagates up the call stack.
* Best handled in a **global exception handler**.

---

## Difference between `is` and `as` in C\#

* `is` → checks compatibility, returns `true`/`false`.
* `as` → performs safe casting, returns `null` if cast fails.

```csharp
object obj = "Hello";
if (obj is string) Console.WriteLine("It's a string");

string s = obj as string;
Console.WriteLine(s ?? "Not a string");
```

---

## Difference between `string` and `String` in C\#

* Both are the same (`string` is an alias for `System.String`).
* Convention: use `string` for declarations, `String` for static methods (e.g., `String.IsNullOrEmpty()`).

---

## Difference between `int` and `Int32`

* `int` is an alias for `System.Int32`. There is no difference.

---

## Difference between `throw` and `throw ex`

* `throw` → preserves the original stack trace.
* `throw ex` → resets the stack trace.

---

## Why use a private constructor?

* To **restrict instantiation** (e.g., Singleton pattern).
* To prevent inheritance.

---

## Sealed class

Used to restrict further inheritance.

```csharp
sealed class A { }
```

---

# Additional Commonly Asked Questions

## Difference between abstract class and interface

* Abstract class → can have fields, constructors, implemented methods.
* Interface → only method declarations (until C# 8 default implementations).
* A class can inherit one abstract class but implement multiple interfaces.

---

## Explain method hiding (`new`) vs overriding (`override`)

* **Override** → runtime polymorphism; child replaces parent implementation.
* **New** → compile-time hiding; parent method still accessible via base reference.

---

## Difference between Encapsulation and Abstraction

* **Abstraction** → hides implementation details, exposes functionality (design level).
* **Encapsulation** → bundles data & methods, restricts direct access (implementation level).

---

## Static class vs instance class

* **Static class** → cannot be instantiated, members are static, exists for application lifetime.
* **Instance class** → requires object creation, each instance has its own copy.

---

## Difference between `ref` and `out` parameters

* `ref` → must be initialized before passing.
* `out` → must be assigned inside the method.

---

## Difference between `const`, `readonly`, and `static`

* **const** → compile-time constant.
* **readonly** → runtime constant (can be set in constructor).
* **static** → shared across all instances.

---

## What are `Func`, `Action`, and `Predicate` delegates?

* **Func<T>** → returns a value.
* **Action<T>** → returns void.
* **Predicate<T>** → returns a boolean.

---

## Difference between value type and reference type

* **Value type** → stored on the stack, holds data directly (struct, int, bool).
* **Reference type** → stored on the heap, variable holds reference (class, object, string).
