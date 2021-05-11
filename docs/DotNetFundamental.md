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

28:00