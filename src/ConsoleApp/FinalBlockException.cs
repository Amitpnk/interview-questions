using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp
{
    public class FinalBlockException
    {
        void call()
        {
            try
            {
                var myClass = new MyClass();
                myClass.Hello();
            }
            catch (Exception)
            {

                throw;
            }
            
        }
    }


    public class MyClass
    {
        public void Hello()
        {
            try
            {

            }
            catch (Exception)
            {

                throw;
            }
            finally
            {
                Console.WriteLine("Before exception");
                int result = Convert.ToInt32("TEN");
                Console.WriteLine("After exception");
            }
        }
    }

}
