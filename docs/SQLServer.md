# SQL Server

## Query fundamentals

### What is the SQL order of execution?

1. `FROM`
2. `WHERE`
3. `GROUP BY`
4. `HAVING`
5. `SELECT`
6. `DISTINCT`
7. `ORDER BY`

```sql
SELECT DISTINCT <TOP_specification> <select_list>
FROM <left_table>
<join_type> JOIN <right_table>
ON <join_condition>
WHERE <where_condition>
GROUP BY <group_by_list>
HAVING <having_condition>
ORDER BY <order_by_list>
```

Including `ON`, `OUTER` and `TOP`:

1. `FROM`
2. `ON`
3. `OUTER` (join)
4. `WHERE`
5. `GROUP BY`
6. `HAVING`
7. `SELECT`
8. `DISTINCT`
9. `ORDER BY`
10. `TOP`

### What are the different types of join?

- Inner join
- Left (outer) join
- Right (outer) join
- Full (outer) join
- Cross join

### What is the purpose of a right join?

A right join returns all rows from the right table, whether or not a match exists in the left table.

A business case: retrieve every department name with the total number of employees in each department (including departments with no employees).

```sql
SELECT DepartmentName, COUNT(Employees.DepartmentID) AS TotalEmployees
FROM Employees
RIGHT JOIN Departments
    ON Departments.DepartmentID = Employees.DepartmentID
GROUP BY DepartmentName
ORDER BY TotalEmployees;
```

### What is the difference between UNION and UNION ALL?

Both combine the result sets of two or more `SELECT` statements.

- **UNION** removes duplicate rows
- **UNION ALL** keeps all rows, including duplicates – so it is faster

### What is a subquery?

A subquery is a query nested inside another `SELECT`, `INSERT`, `UPDATE` or `DELETE` statement.

```sql
SELECT Name
FROM Employees
WHERE Salary > (SELECT AVG(Salary) FROM Employees);
```

### How do you copy data from one table to another?

- **`INSERT INTO ... SELECT`** – inserts data into a table that already exists
- **`SELECT ... INTO`** – creates a new table and copies the structure and data from an existing table

```sql
INSERT INTO EmployeesArchive (Id, Name)
SELECT Id, Name FROM Employees;

SELECT * INTO EmployeesBackup FROM Employees;
```

### How do you get the number of records in a table?

```sql
SELECT COUNT(*) FROM <tablename>;

-- Faster for large tables: read the row count from metadata
SELECT SUM(rows)
FROM sys.partitions
WHERE object_id = OBJECT_ID('<tablename>') AND index_id IN (0, 1);
```

### What is TABLESAMPLE?

`TABLESAMPLE` returns a random sample of rows from a table, based on a percentage or number of rows.

```sql
SELECT * FROM Employees TABLESAMPLE (10 PERCENT);
```

## Built-in functions

### What is COALESCE?

`COALESCE` returns the first non-null expression among its arguments.

```sql
SELECT COALESCE(NULL, NULL, 2, 3);
-- OUTPUT: 2
```

### What is ISNULL()?

`ISNULL` replaces `NULL` with a specified value.

```sql
SELECT ISNULL(MiddleName, 'N/A') FROM Employees;
```

### What is the purpose of the FLOOR function?

`FLOOR` rounds a non-integer value **down** to the nearest integer.

```sql
SELECT FLOOR(25.75) AS FloorValue;
-- OUTPUT: 25
```

### What is the SIGN function used for?

`SIGN` tells you whether a number is positive, negative or zero, returning `1`, `-1` or `0`.

```sql
SELECT SIGN(-12);
-- OUTPUT: -1
```

### What is the difference between SUBSTRING and CHARINDEX?

- `SUBSTRING` returns part of a string
- `CHARINDEX` returns the position of a character (or substring) within a string

```sql
SELECT SUBSTRING('Smiley', 1, 3); -- Smi
SELECT CHARINDEX('i', 'Smiley');  -- 3
```

### What is the difference between GETDATE and SYSDATETIME?

Both return the current date and time.

- `GETDATE()` returns `datetime`, accurate to about 3 milliseconds
- `SYSDATETIME()` returns `datetime2(7)`, accurate to 100 nanoseconds

## Query problems

### How do you find the nth highest salary?

```sql
DECLARE @N INT = 2;

WITH Result AS
(
    SELECT Salary, DENSE_RANK() OVER (ORDER BY Salary DESC) AS DenseRank
    FROM tblEmployee
)
SELECT TOP 1 Salary
FROM Result
WHERE DenseRank = @N;
```

### How do you find duplicate rows in a table?

```sql
WITH Result AS
(
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY Salary ORDER BY Id) AS DuplicateCount
    FROM tblEmployee
)
SELECT *
FROM Result
WHERE DuplicateCount > 1;
```

### How do you delete duplicate rows from a table?

```sql
WITH Result AS
(
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY Salary ORDER BY Id) AS DuplicateCount
    FROM tblEmployee
)
DELETE FROM Result
WHERE DuplicateCount > 1;
```

### How do you find employees hired in the last N months?

```sql
SELECT *
FROM Employees
WHERE DATEDIFF(MONTH, HireDate, GETDATE()) BETWEEN 1 AND @N;
```

### How do you transform rows into columns?

Use the `PIVOT` operator:

```sql
SELECT Country, City1, City2, City3
FROM
(
    SELECT Country, City,
           'City' + CAST(ROW_NUMBER() OVER (PARTITION BY Country ORDER BY Country) AS VARCHAR(10)) AS ColumnSequence
    FROM Countries
) Temp
PIVOT
(
    MAX(City)
    FOR ColumnSequence IN (City1, City2, City3)
) Piv;
```

### How do you find rows that contain only numeric data?

`ISNUMERIC` returns `1` when the value can be converted to a numeric type:

```sql
SELECT Value FROM TestTable WHERE ISNUMERIC(Value) = 1;
```

> **Note:** `ISNUMERIC` also returns `1` for values such as `'$'`, `'-'` and `'1e5'`. To match digits only, use `WHERE Value NOT LIKE '%[^0-9]%'`, or `TRY_CAST(Value AS INT) IS NOT NULL`.

### How do you find the department with the highest number of employees?

```sql
SELECT TOP 1 DepartmentName
FROM Employees
JOIN Departments
    ON Employees.DepartmentID = Departments.DepartmentID
GROUP BY DepartmentName
ORDER BY COUNT(*) DESC;
```

### How do you get an organisation hierarchy?

Use a recursive CTE:

```sql
DECLARE @ID INT = 7;

WITH EmployeeCTE AS
(
    SELECT EmployeeId, EmployeeName, ManagerID
    FROM Employees
    WHERE EmployeeId = @ID

    UNION ALL

    SELECT Employees.EmployeeId, Employees.EmployeeName, Employees.ManagerID
    FROM Employees
    JOIN EmployeeCTE
        ON Employees.EmployeeId = EmployeeCTE.ManagerID
)
SELECT E1.EmployeeName, ISNULL(E2.EmployeeName, 'No Boss') AS ManagerName
FROM EmployeeCTE E1
LEFT JOIN EmployeeCTE E2
    ON E1.ManagerID = E2.EmployeeId;
```

## Window functions

### Explain ROW_NUMBER(), PARTITION BY, RANK() and DENSE_RANK()

```sql
SELECT
    ROW_NUMBER() OVER (ORDER BY Name) AS RowNumber,
    ROW_NUMBER() OVER (PARTITION BY Salary ORDER BY Name) AS RowNumberPartition,
    DENSE_RANK() OVER (ORDER BY Salary) AS SalaryDense,
    RANK() OVER (ORDER BY Salary) AS SalaryRank,
    Name,
    Salary
FROM Employee;
```

| RowNumber | RowNumberPartition | SalaryDense | SalaryRank | Name | Salary |
| --- | --- | --- | --- | --- | --- |
| 5 | 1 | 1 | 1 | Ravi | 10000.00 |
| 3 | 1 | 2 | 2 | Menaka | 15000.00 |
| 7 | 2 | 2 | 2 | Vishal | 15000.00 |
| 2 | 1 | 3 | 4 | Mahesh | 18000.00 |
| 1 | 1 | 4 | 5 | Akshay | 20000.00 |
| 4 | 2 | 4 | 5 | Rahul | 20000.00 |
| 6 | 3 | 4 | 5 | Sam | 20000.00 |

What each column is useful for:

- **RowNumber** – generating a serial number
- **RowNumberPartition** – finding duplicates
- **SalaryDense** – finding the nth highest salary (no gaps after ties)
- **SalaryRank** – ranking with gaps after ties

## Database objects

### Can views be updated?

Yes. You can `INSERT`, `UPDATE` and `DELETE` through a view, as long as the change affects only one base table.

```sql
DELETE FROM my_View WHERE Id = 3;
```

### What is the difference between local temporary tables, global temporary tables and table variables?

- **Local temporary table** (`#table`) – visible only to the session that created it; dropped when that session ends
- **Global temporary table** (`##table`) – visible to all sessions; dropped when the creating session ends and no other session is using it
- **Table variable** (`@table`) – scoped to the batch, stored procedure or function in which it is declared

```sql
CREATE TABLE #LocalTemp (Id INT);
CREATE TABLE ##GlobalTemp (Id INT);
DECLARE @TableVariable TABLE (Id INT);
```

### What is a CHECK constraint?

A CHECK constraint limits the range of values that can be placed in a column.

```sql
CREATE TABLE Persons (
    ID INT NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255),
    Age INT,
    CHECK (Age >= 18)
);
```

### What is an IDENTITY column?

An IDENTITY column generates an auto-incrementing number, typically used as a surrogate primary key.

```sql
CREATE TABLE tblEmployee (Id INT PRIMARY KEY IDENTITY(1, 1), Name NVARCHAR(50));
```

### What is the difference between varchar and nvarchar?

`nvarchar` stores Unicode characters (for multiple languages) and uses 2 bytes per character; `varchar` stores non-Unicode characters and uses 1 byte per character.

### What is the XML data type?

The XML data type stores XML documents in a column or variable, and supports querying them with XQuery.

### What is a trigger?

A trigger is a special stored procedure that runs automatically when an event occurs, such as an `INSERT`, `UPDATE` or `DELETE` on a table.

### What are the types of triggers?

- **DML triggers** – `AFTER` (`FOR`) `INSERT`, `UPDATE` or `DELETE`, and `INSTEAD OF` triggers
- **DDL triggers** – fire on `CREATE`, `ALTER` and `DROP` statements
- **Logon triggers** – fire when a user session is established

### What are magic tables?

During `INSERT`, `UPDATE` and `DELETE` operations, SQL Server creates the `inserted` and `deleted` tables to hold the new and old values. They are available inside triggers.

### How do you list the triggers in a database?

```sql
SELECT * FROM sys.triggers;
```

### Which tables hold stored procedure scripts?

The script of a stored procedure is stored in `sys.sql_modules`, and its name in `sys.procedures`.

### How do you recompile a stored procedure at run time?

```sql
EXEC <SPName> WITH RECOMPILE;
```

Or add `WITH RECOMPILE` to the stored procedure definition itself.

## Indexes and performance

### What is the difference between a clustered and a non-clustered index?

With a **clustered index**, the rows are stored physically on disk in the same order as the index, so there can be only one clustered index per table.

With a **non-clustered index**, there is a separate structure with pointers to the physical rows. You can have many non-clustered indexes, although each one increases the time it takes to write records.

| | Clustered | Non-clustered |
| --- | --- | --- |
| Per table | One | Many (up to 999) |
| Stores data | Yes – the leaf level is the data | No – the leaf level points to the data |

### What is the maximum number of indexes per table?

One clustered index and 999 non-clustered indexes.

### What is a filtered index?

A filtered index is a non-clustered index with a `WHERE` clause, so it covers only part of the table. It improves query performance and reduces index maintenance and storage costs.

```sql
CREATE NONCLUSTERED INDEX IX_Orders_Open
ON Orders (OrderDate)
WHERE Status = 'Open';
```

### What is the difference between a logical read and a physical read?

- **Logical read** – the page is read from the buffer cache (memory)
- **Physical read** – the page is not in memory, so it is read from disk into the buffer cache

Physical reads are much slower. You can see both with `SET STATISTICS IO ON`.

### How do you tune SQL Server performance?

- Avoid `SELECT *` – select only the columns you need
- Normalise tables
- Keep the clustered index key small
- Store image paths instead of images
- Use CTEs instead of temp tables where appropriate
- Use appropriate naming conventions (e.g. `usp_` instead of `sp_` for stored procedures)
- Use stored procedures for complex logic
- Check execution plans and add the right indexes

### What is SET NOCOUNT ON/OFF?

By default, `NOCOUNT` is `OFF` and SQL Server returns the number of rows affected by each statement. `SET NOCOUNT ON` stops these messages, which reduces network traffic in stored procedures.

### How do you check locks in a database?

Query the `sys.dm_tran_locks` DMV (the older `sp_lock` procedure is deprecated).

```sql
SELECT * FROM sys.dm_tran_locks;
```

## Transactions and error handling

### What is the difference between COMMIT and ROLLBACK?

- `COMMIT` makes every statement since `BEGIN TRANSACTION` permanent
- `ROLLBACK` reverts every statement since `BEGIN TRANSACTION`

### How are exceptions handled in SQL Server?

With `TRY ... CATCH`:

```sql
BEGIN TRY
    -- T-SQL statements
END TRY
BEGIN CATCH
    SELECT ERROR_NUMBER(), ERROR_MESSAGE();
END CATCH
```

### Which command raises user-defined error messages?

`RAISERROR` (or `THROW`, from SQL Server 2012). User-defined messages can be stored in `sys.messages`.

```sql
RAISERROR ('Invalid customer', 16, 1);
THROW 50001, 'Invalid customer', 1;
```

## Security and administration

### What are the two authentication modes in SQL Server?

- Windows authentication mode
- Mixed mode (Windows and SQL Server authentication)

### Where are SQL Server user names and passwords stored?

In `sys.server_principals` and `sys.sql_logins`. Passwords are stored as hashes, not plain text.

### What is SQL injection?

SQL injection is an attack in which malicious code is inserted into strings that are passed to SQL Server for parsing and execution.

### How do you protect against SQL injection?

- Use parameterised queries and stored procedures with parameters
- Validate and filter input
- Use `sp_executesql` with parameters for dynamic SQL
- Escape wildcard characters in `LIKE` clauses
- Give the application login the least privileges it needs

### What is SQL Profiler?

SQL Profiler is a tool for administrators to monitor and trace events in SQL Server. (Extended Events is the modern replacement.)

### Can SQL Server be linked to other servers?

Yes. Linked servers let SQL Server query any data source that has an OLE DB provider – for example, Oracle.

### What are scheduled tasks (jobs)?

Jobs, run by SQL Server Agent, automate processes on a schedule – for example, nightly backups or data loads – reducing manual intervention.

### What is CDC?

CDC (Change Data Capture), available from SQL Server 2008, records the inserts, updates and deletes made to a table so the changes can be consumed later.

### What is bulk copy?

Bulk copy (the `bcp` utility, or `BULK INSERT`) copies large amounts of data into or out of tables quickly.

### What is @@SPID?

`@@SPID` returns the session ID of the current user process.
