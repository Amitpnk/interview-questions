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

