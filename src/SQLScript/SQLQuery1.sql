create table tblEmployee 
(
	Id int primary key identity(1,1),
	FirstName nvarchar(50),
	SecondName nvarchar(50),
	Gender nvarchar(50),
	Salary money
)

INSERT INTO tblEmployee([Firstname],[SecondName],Gender,Salary) 
VALUES('Georgia','Wooten','Male',7000)
,('Noel','Hobbs','Male',6000),
('Sean','Mcdonald','Male',4500),
('Dominique','Sampson','Male',7000),
('Abel','Brewer','Male',4500),
('Quinn','Pitts','Female',3000),
('Mona','Lee','Female',3500),
('Otto','Ball','Male',8000)
