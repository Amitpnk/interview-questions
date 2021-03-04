using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp
{
    public static class DiffTypeSingleGeneric
    {
        public static void SingleMethod()
        {
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

        }
    }
}
