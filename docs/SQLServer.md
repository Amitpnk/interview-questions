# SQL server

## Table of Contents

| No. | Questions |
| --- | --------- |
||**SQL server**|
|1  | [Defining SQL order of execution](#defining-sql-order-of-execution) |
|2  | [How to find nth highest salary in sql](#how-to-find-nth-highest-salary-in-sql) |
|3 | [How to find duplicate rows from a SQL Table](#how-to-find-duplicate-rows-from-a-sql-table) |
|4 | [Can sql views be updated](#can-sql-views-be-updated) |
|5 | [SQL query to find employees hired in last n months](#sql-query-to-find-employees-hired-in-last-n-months) |
|6 | [Transform rows into columns in sql server](#transform-rows-into-columns-in-sql-server) |
|7 | [SQL query to find rows that contain only numerical data](#sql-query-to-find-rows-that-contain-only-numerical-data) |
|8 | [SQL Query to find department with highest number of  employees](#sql-query-to-find-department-with-highest-number-of-employees) |
|9 | [Different types of join in sql](#different-types-of-join-in-sql) |
|10 | [What is purpose of right join?](#what-is-purpose-of-right-join) |


1. ### Defining SQL order of execution

    * FROM clause
    * WHERE clause
    * GROUP BY clause
    * HAVING clause
    * SELECT clause
    * DISTINCT clause
    * ORDER BY clause

    ```SQL
    SELECT DISTINCT <TOP_specification> <select_list>
    FROM <left_table>
    <join_type> JOIN <right_table>
    ON <join_condition>
    WHERE <where_condition>
    GROUP BY <group_by_list>
    HAVING <having_condition>
    ORDER BY <order_by_list>
    ```

    including on, outer and top

    * FROM clause
    * ON clause
    * OUTER clause
    * WHERE clause
    * GROUP BY clause
    * HAVING clause
    * SELECT clause
    * DISTINCT clause
    * ORDER BY clause
    * TOP clause

2. ### How to find nth highest salary in sql

```sql
with  result as
(
	select salary, dense_rank() over (order by salary desc) DenseRank
	from [tblEmployee]
)
select top 1 * from result where denserank =2;
```

3. ### How to find duplicate rows from a SQL Table

```sql
WITH result AS 
(SELECT *, 
        ROW_NUMBER() OVER(PARTITION BY salary
           ORDER BY id) AS DuplicateCount
    FROM [tblEmployee]
	)
SELECT *
FROM result where DuplicateCount <2 ;
```

4. ### Can sql views be updated

Yes, as per MSDN you can do Insert, update, delete on a view as long as it is derived from just a single table

```sql
DELETE FROM my_View WHERE id = 3;
```

5. ### SQL query to find employees hired in last n months

```sql
Select *
FROM Employees
Where DATEDIFF(MONTH, HireDate, GETDATE()) Between 1 and N
```

6. ### Transform rows into columns in sql server

Using PIVOT operator we can very easily transform rows to columns

```sql
Select Country, City1, City2, City3
From
(
  Select Country, City,
    'City'+
      cast(row_number() over(partition by Country order by Country) 
     as varchar(10)) ColumnSequence
  from Countries
) Temp
pivot
(
  max(City)
  for ColumnSequence in (City1, City2, City3)
) Piv
```

7. ### SQL query to find rows that contain only numerical data

ISNUMERIC function returns 1 
```sql
SELECT Value FROM TestTable WHERE ISNUMERIC(Value) = 1
```

8. ### SQL Query to find department with highest number of  employees

```sql
SELECT TOP 1 DepartmentName
FROM Employees
JOIN Departments
ON Employees.DepartmentID = Departments.DepartmentID
GROUP BY DepartmentName
ORDER BY COUNT(*) DESC
```

9. ### Different types of join in sql

* Inner join <br>
* Left join <br>
* Right join <br>
* Full join <br>
* Cross join <br>

10. ### What is purpose of right join

Right join returns all rows from Right table irrespective of whetherr match exists in left table or not

Another business case for using RIGHT JOIN on the above 2 tables is to retrieve all the Department Names and the total number of Employees with in each department.

```sql
Select DepartmentName, Count(Employees.DepartmentID) as TotalEmployees
From Employees
Right Join Departments
ON Departments.DepartmentID = Employees.DepartmentID
Group By DepartmentName
Order By TotalEmployees
```

11. ### How to get organization hierarchy


Declare @ID int ;
Set @ID = 7;
```sql
WITH EmployeeCTE AS
(
 Select EmployeeId, EmployeeName, ManagerID
 From Employees
 Where EmployeeId = @ID
 
 UNION ALL
 
 Select Employees.EmployeeId , Employees.EmployeeName, Employees.ManagerID
 From Employees
 JOIN EmployeeCTE
 ON Employees.EmployeeId = EmployeeCTE.ManagerID
)

Select E1.EmployeeName, ISNULL(E2.EmployeeName, 'No Boss') as ManagerName
From EmployeeCTE E1
LEFT Join EmployeeCTE E2
ON E1.ManagerID = E2.EmployeeId
```

12. ### How to delete duplicate rows from a SQL Table

```sql
WITH result AS 
(SELECT *, 
        ROW_NUMBER() OVER(PARTITION BY salary
           ORDER BY id) AS DuplicateCount
    FROM [tblEmployee]
	)
DELETE
FROM result where DuplicateCount > 1 ;
```

13. ### Difference between Clustered and non clustered index

With a clustered index the rows are stored physically on the disk in the same order as the index. Therefore, there can be only one clustered index.

With a non clustered index there is a second list that has pointers to the physical rows. You can have many non clustered indices, although each new index will increase the time it takes to write new records

|  |Clustered |Non clustered |
|---|---|---|
|Indexes |One index per table| Multiple index per table|
|Unique|True|False|


14. ### Difference between Logical read and physical read

15. ### Performance tuning on SQL server

* Select * Statement
* Normalize tables
* Keep clustered index small
* Store image path instead of image
* Use CTE instead of Temp table
* Appropriate naming convention (like usp instead of sp)
* Stored procedure - for complex logic

16. ### Explain Row_number(), partition, rank() and DenseRank()

```sql
select 
	ROW_NUMBER() over (order by name) as rownumber,
	ROW_NUMBER() over (partition by salary order by name) as rownumber_partition,
	dense_rank() over (  order by salary) as salary_dense,
	rank() over (  order by salary) as salary_rank,
	name, 
	salary 
from [Employee] 
```
 
|	rownumber	|	rownumber_partition	|	salary_dense	|	salary_rank	|	name	|	salary	|
|---|---|---|---|---|---
|	5	|	1	|	1	|	1	|	Ravi	|	10000.00	|
|	3	|	1	|	2	|	2	|	menaka	|	15000.00	|
|	7	|	2	|	2	|	2	|	Vishal	|	15000.00	|
|	2	|	1	|	3	|	4	|	Mahesh	|	18000.00	|
|	1	|	1	|	4	|	5	|	akshay	|	20000.00	|
|	4	|	2	|	4	|	5	|	Rahul	|	20000.00	|
|	6	|	3	|	4	|	5	|	Sam	|	20000.00	|

Note: column
* rownumber - for generate serial number
* rownumber_partition - to find duplicate
* salary_dense - to find nth highest salary
* salary_rank - serial number for unique salary