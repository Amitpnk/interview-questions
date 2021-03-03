using System;

namespace ConsoleApp
{
    class Program
    {
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
    }

  
}
