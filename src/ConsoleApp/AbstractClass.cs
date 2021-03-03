using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp
{
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
}
