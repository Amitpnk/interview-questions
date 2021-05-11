# C# and .Net Framework

## Table of Contents

| No. | Questions |
| --- | --------- |

1. ### What is Intermediate Language (IL) code (or MSIL-Microsoft ILS or CIL-Common IL )

* IL code is partially compiled code
* on runtime this code is compiled to machine specific using the environmental properties (CPU,OS, machine configuration etc).

via ILDASM tool we can view a IL code of a DLL or EXE

2. ### JIT (Just in compiler)

JIR compiled IL code to machine language

3. ### Different types of JIT

* Normal-JIT (Default): - Normal-JIT compiles only those methods that are called at runtime (cached takes more memory like ASP.NET and windows application)
* Econo-JIT: - Econo-JIT compiles only those methods that are called at runtime (No caching takes less memory like mob device and console applicaion)
* Pre-JIT: - Pre-JIT compiles complete source code into native code in a single compilation cycle. This is done at the time of deployment of the application

4. ### CLR (Common Language Runtime)

* Invokes JIT to compile from IL to machine language or native code
* Cleans an unused objects by using GC

5. ### Managed code & unmanaged code

* Managed code - which runs under the control of CLR
* Unmanaged code - which runs outside CLR (like C++, C etc)

6. ### Garbage collector

Garbage collector is a back ground process which cleans unused managed resources. 

```c#
for (int a =0; a<1000000000; a++){
       cls obj = new cls();
}
```

Can be checked via Visual studio Diagonotic viewer or CLR profiler 

7. ### CTS (Common Type System)

Ensures data types defined in two different languages gets compiled to a common data type.

```vb
Dim i As Integer
```

```c#
int i;
```

8. ### CLS(Common Language Specification)

Specification/set of rules/Guideliness of the source code.

9. ### Difference between Stack and Heap

Stack memory stores data types like int, double, boolean,
Heap memory stores like string and objects.

10. ### Difference between value and reference type

Value types contains actual data
Reference types contains pointers and pointers point to actual data

```c#
int i =10;
bool b = true;
Customer obj= new Customer();
obj.Name = "Amit";
```

![img](./img/StackHeap.png)

11. ### Difference between boxing and unboxing

Box - Convert from value to reference
Unboxing - reference type to value

VR-B
RV-U

```c#
public void method()
{
     int i=10;
     object obj =I;   //boxing
     int j =(int)obj;  //unboxing
}
```

unboxing and boxing bring down performance because data has to jump between heap and stack memory types

12. ### Explain casting, implicit casting and explicit casting

Casting where we convert one type of data type to other data type
* Implicit casting -  move from lower to higher data type
* Explicit casting -  move from higher to lower data type

```c#
int i1 =10;
double d1 =i1; // implict casting

double d2 = 500.2;
int y = (int)d2; // explicit casting - data lose
```

13. ### Difference between Array and ArrayList

||Array|ArrayList|
|---|---|---|
|Fixed length|yes|no|
|Strongly typed|yes|no|
|Performance|Better then Array list|Slower because of boxing/unboxing|

ArrayList is slower than Array because of Boxing and Unboxing

```c#
int[] arr = {1,2,3};  

ArrayList arrList = new ArrayList();
arrList.Add(1);
arrList.Add(2);
arrList.Add("three");
```

14. ### Generic collection

Generic collection is strongly typed and flexible. It has better performance as compared to ArrayList

```c#
List<int> lt = new List<int>();
lt.Add(1);
lt.Add(2);
```