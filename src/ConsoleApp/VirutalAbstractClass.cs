using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp
{
    public class VirutalAbstractClass
    {
        
    }

    public abstract class AbstractClass
    {
        public virtual void AbstractClassMethod()
        {
            Console.WriteLine("Default implementation");
        }
    }

    public class SomeClass: AbstractClass
    {

    }

    public class SomeOtherClass : AbstractClass
    {
        public override void AbstractClassMethod()
        {
            Console.WriteLine("new implementation");
        }
    }
}
