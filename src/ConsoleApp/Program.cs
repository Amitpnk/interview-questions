using System;

namespace ConsoleApp
{
    class Program
    {
        static void Main()
        {
            //int num = Convert.ToInt32(Console.ReadLine());

            //double facotrial = FactorialNumber.Factorial(num);
            //Console.WriteLine(facotrial);

            //DiffTypeSingleGeneric.SingleMethod();

            //var savingCustomer = new SavingCustomer();

            //int? ticketOnSale = 100;

            //int availableTickets;



            //availableTickets = ticketOnSale ?? 0;

            //Console.WriteLine(availableTickets);


            //string strNumber = "100GB";

            //int Result;

            //int.TryParse(strNumber, out Result);

            //Console.WriteLine(Result);


            int val = 10; // have to initial the value
            methodFunction(out val);
            Console.WriteLine(val);

        }

        static void methodFunction(out int i)
        {
            i = 44;
        }
    }
}
