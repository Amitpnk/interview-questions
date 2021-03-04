using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp
{
    public abstract class Customer
    {
        protected Customer()
        {
            Print();
        }

        public abstract void Print();
    }

    public class CorporateCustomer : Customer
    {
        public override void Print()
        {
            Console.WriteLine("Corporate print");
        }
    }

    public class SavingCustomer : Customer
    {
        public override void Print()
        {
            Console.WriteLine("SavingCustomer print");
        }
    }

}
