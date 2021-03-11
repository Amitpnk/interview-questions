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

16. ### What is nullable type? difference between ? (nullable type) and ?? (Null Coalescing Operator)

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

17. ### Difference between Parse and TryParse

Parse() method throws an exception if it cannot parse value
TryParse() retruns bool indicating whether it succeeded or failed

```C#
string strNumber = "100GB";

int Result;

int.TryParse(strNumber,out Result);

Console.WriteLine(Result);
```

18. ### What is Arrays?

An array is collectioon of similar data types.

Advantages: Arrays are strongly typed

Disadvantages: Array cannot grow in size once initiazed

```c#
int[] val = new int[3];
val[0] = 11;
val[0] = 12;

int[] val2 = {1,2,3};

```

19. ### static class and instance

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

1. ### What are the two authentication modes in SQL Server?

There are two authentication modes –

* Windows Mode
* Mixed Mode

2. ### What Is SQL Profiler?

system administrator to monitor events in the SQL server.

3. ### What are the differences between local and global temporary tables and table variables

Local temporary tables are visible when there is a connection, and are deleted when the connection is closed.

```sql
CREATE TABLE #<tablename>
```

Global temporary tables are visible to all users, and are deleted when the connection that created it is closed.

```sql
CREATE TABLE ##<tablename>
```

4. ### What is CHECK constraint?

CHECK constraint is used to limit the value range that can be placed in a column

```sql
CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    CHECK (Age>=18)
);
```

5. ### Can SQL servers linked to other servers?

SQL server can be connected to any database which has OLE-DB provider to give a link. Example: Oracle has OLE-DB provider which has link to connect with the SQL server group.

8. ### What is sub query and its properties?

A sub-query is a query which can be nested inside a main query like Select, Update, Insert or Delete statements.  

9. ### What are scheduled tasks in SQL Server?

Scheduled tasks or jobs are used to automate processes that can be run on a scheduled time at a regular interval. This scheduling of tasks helps to reduce human intervention during night time and feed can be done at a particular time. 

10. ### What is COALESCE in SQL Server?

COALESCE is used to return first non-null expression within the arguments. 

```SQL
SELECT COALESCE(NULL, NULL, 2, 'SQL');
-- OUTPUT - 2
```

11. ### How exceptions can be handled in SQL Server Programming?

Exceptions are handled using TRY----CATCH constructs 

```SQL
BEGIN TRY
--T-SQL statements
END TRY
BEGIN CATCH
--T-SQL statements
END CATCH 
```

12. ### What is the purpose of FLOOR function?

FLOOR function is used to round up a non-integer value to the previous least integer. Example is given

```SQL
SELECT FLOOR(25.75) AS FloorValue;
-- OUTPUT - 25
```

13. ### Can we check locks in database? If so, how can we do this lock check?

Yes, we can check locks in the database. It can be achieved by using in-built stored procedure called sp_lock.

14. ### What is the use of SIGN function?

SIGN function is used to determine whether the number specified is Positive, Negative and Zero. This will return +1,-1 or 0.

```sql
SELECT SIGN(-12);
-- OUTPUT -> -1
```

15. ### What is a Trigger?

Triggers are used to execute a batch of SQL code when insert or update or delete commands are executed against a table.

16. ### What are the types of Triggers?

There are four types of triggers and they are:

* Insert
* Delete
* Update
* Instead of

17. ### What is an IDENTITY column in insert statements?

IDENTITY column is used in table columns to make that column as Auto incremental number or a surrogate key.

18. ### What is Bulkcopy in SQL?

Bulkcopy is a tool used to copy large amount of data from Tables. 

19. ### What will be query used to get the list of triggers in a database?

Query to get the list of triggers in database-

```sql
Select * from sys.objects where type='tr'
```

20. ### What is the difference between UNION and UNION ALL?

UNION: To select related information from two tables UNION command is used. It is similar to JOIN command.

UNION All: The UNION ALL command is equal to the UNION command, except that UNION ALL selects all values. It will **not remove duplicate rows**, instead it will retrieve all rows from all tables.

------------------------------

21. ### How can we get count of the number of records in a table?

Following are the queries can be used to get the count of records in a table -


Select * from <tablename>

 Select count(*) from <tablename> Select rows from sysindexes where id=OBJECT_ID(tablename) and indid<2

28. What is the use of SET NOCOUNT ON/OFF statement?

By default, NOCOUNT is set to OFF and it returns number of records got affected whenever the command is getting executed. If the user doesn't want to display the number of records affected, it can be explicitly set to ON- (SET NOCOUNT ON).

29. Which SQL server table is used to hold the stored procedure scripts?

Sys.SQL_Modules is a SQL Server table used to store the script of stored procedure.

Name of the stored procedure is saved in the table called Sys.Procedures.

30. What are Magic Tables in SQL Server?

During DML operations like Insert, Delete, and Update, SQL Server creates magic tables to hold the values during the DML operations. These magic tables are used inside the triggers for data transaction.

31. What is the difference between SUBSTR and CHARINDEX in the SQL Server?

The SUBSTR function is used to return specific portion of string in a given string. But, CHARINDEX function gives character position in a given specified string.

SUBSTRING('Smiley',1,3)
Gives result as Smi

CHARINDEX('i', 'Smiley',1)
Gives 3 as result as I appears in 3rd position of the string

33. What is ISNULL() operator?

ISNULL function is used to check whether value given is NULL or not NULL in sql server. This function also provides to replace a value with the NULL.

35. What will be the maximum number of index per table?

For SQL Server 2008 100 Index can be used as maximum number per table. 1 Clustered Index and 999 Non-clustered indexes per table can be used in SQL Server.

1000 Index can be used as maximum number per table. 1 Clustered Index and 999 Non-clustered indexes per table can be used in SQL Server.

1 Clustered Index and 999 Non-clustered indexes per table can be used in SQL Server.

36. What is the difference between COMMIT and ROLLBACK?

Every statement between BEGIN and COMMIT becomes persistent to database when the COMMIT is executed. Every statement between BEGIN and ROOLBACK are reverted to the state when the ROLLBACK was executed.

37. What is the difference between varchar and nvarchar types?

Varchar and nvarchar are same but the only difference is that nvarhcar can be used to store Unicode characters for multiple languages and it also takes more space when compared with varchar.

38. What is the use of @@SPID?

A @@SPID returns the session ID of the current user process.

39. What is the command used to Recompile the stored procedure at run time?

Stored Procedure can be executed with the help of keyword called RECOMPILE.

Example

Exe <SPName>  WITH RECOMPILE
Or we can include WITHRECOMPILE in the stored procedure itself.

40. How to delete duplicate rows in SQL Server?

Duplicate rows can be deleted using CTE and ROW NUMER feature of SQL Server.

41. Where are SQL Server user names and passwords stored in SQL Server?

User Names and Passwords are stored in sys.server_principals and sys.sql_logins. But passwords are not stored in normal text.

42. What is the difference between GETDATE and SYSDATETIME?

Both are same but GETDATE can give time till milliseconds and SYSDATETIME can give precision till nanoseconds. SYSDATE TIME is more accurate than GETDATE.

43. How data can be copied from one table to another table?

INSERT INTO SELECT

This command is used to insert data into a table which is already created.

SELECT INTO

This command is used to create a new table and its structure and data can be copied from existing table.

44. What is TABLESAMPLE?

TABLESAMPLE is used to extract sample of rows randomly that are all necessary for the application. The sample rows taken are based on the percentage of rows.

45. Which command is used for user defined error messages?

RAISEERROR is the command used to generate and initiates error processing for a given session. Those user defined messages are stored in sys.messages table.

46. What do mean by XML Datatype?

XML data type is used to store XML documents in the SQL Server database. Columns and variables are created and store XML instances in the database.

47. What is CDC?

CDC is abbreviated as Change Data Capture which is used to capture the data that has been changed recently. This feature is present in SQL Server 2008.

48. What is SQL injection?

SQL injection is an attack by malicious users in which malicious code can be inserted into strings that can be passed to an instance of SQL server for parsing and execution. All statements have to checked for vulnerabilities as it executes all syntactically valid queries that it receives.

Even parameters can be manipulated by the skilled and experienced attackers.

49. What are the methods used to protect against SQL injection attack?

Following are the methods used to protect against SQL injection attack:

Use Parameters for Stored Procedures
Filtering input parameters
Use Parameter collection with Dynamic SQL
In like clause, user escape characters
50. What is Filtered Index?

Filtered Index is used to filter some portion of rows in a table to improve query performance, index maintenance and reduces index storage costs. When the index is created with WHERE clause, then it is called Filtered Index