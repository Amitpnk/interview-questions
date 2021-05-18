# C# Coding Questions 

## Reverse string

```ps1
input: hello, output: olleh
input: hello world, output: dlrow olleh
```

```c#
public static void ReverseString(string str)  
{  
      
    char[] charArray = str.ToCharArray();  
    for (int i = 0, j = str.Length - 1; i < j; i++, j--)  
    {  
        charArray[i] = str[j];  
        charArray[j] = str[i];  
    }  
    string reversedstring = new string(charArray);  
    Console.WriteLine(reversedstring);  
}
```

## reverse the order of words in a given string

```ps1
input: Welcome to hello world, output: world hello to Welcome
```

```c#
public static void ReverseWordOrder(string str)  
{  
    int i;  
    StringBuilder reverseSentence = new StringBuilder();  
  
    int Start = str.Length - 1;  
    int End = str.Length - 1;  
  
    while (Start > 0)  
    {  
        if (str[Start] == ' ')  
        {  
            i = Start + 1;  
            while (i <= End)  
            {  
                reverseSentence.Append(str[i]);  
                i++;  
            }  
            reverseSentence.Append(' ');  
            End = Start - 1;  
        }  
        Start--;  
    }  
  
    for (i = 0; i <= End; i++)  
    {  
        reverseSentence.Append(str[i]);  
    }  
    Console.WriteLine(reverseSentence.ToString());  
}
```

## reverse each word in a given string

```ps1
input: Welcome to hello world, output: emocleW ot olleh dlrow
```

```c#
public static void ReverseWords(string str)  
 {  
     StringBuilder output = new StringBuilder();  
     List<char> charlist = new List<char>();  
  
     for (int i = 0; i < str.Length; i++)  
     {  
         if (str[i] == ' ' || i == str.Length - 1)  
         {  
             if (i == str.Length - 1)  
                 charlist.Add(str[i]);  
             for (int j = charlist.Count - 1; j >= 0; j--)  
                 output.Append(charlist[j]);  
  
             output.Append(' ');  
             charlist = new List<char>();  
         }  
         else  
             charlist.Add(str[i]);  
     }  
     Console.WriteLine(output.ToString());  
 }
```

## given string is a palindrome or not

```ps1
input: madam, output: Palindrome
input: step on no pets, output: Palindrome
input: book, output: Not Palindrome
```

```c#
public static void chkPalindrome(string str)  
 {  
     bool flag = false;  
     for (int i = 0, j = str.Length - 1; i < str.Length / 2; i++, j--)  
     {  
         if (str[i] != str[j])  
         {  
             flag = false;  
             break;  
         }  
         else  
             flag = true;  
     }  
     if (flag)  
     {  
         Console.WriteLine("Palindrome");  
     }  
     else  
         Console.WriteLine("Not Palindrome");  
 }
```

## Count the occurrence of each character in a string

```ps1
input: hello world;
output: h – 1
e – 1
l – 3
o – 2
w – 1
r – 1
d – 1
```

```c#
public static void Countcharacter(string str)  
{  
    Dictionary<char, int> characterCount = new Dictionary<char, int>();  
  
    foreach (var character in str)  
    {  
        if (character != ' ')  
        {  
            if (!characterCount.ContainsKey(character))  
            {  
                characterCount.Add(character, 1);  
            }  
            else  
            {  
                characterCount[character]++;  
            }  
        }  
  
    }  
    foreach (var character in characterCount)  
    {  
        Console.WriteLine("{0} - {1}", character.Key, character.Value);  
    }  
}
```

## Remove duplicate characters from a string

```ps1
input: helloworld, output: helowrd
```

```c#
internal static void removeduplicate(string str)  
{  
    string result = string.Empty;  

    for (int i = 0; i < str.Length; i++)  
    {  
        if (!result.Contains(str[i]))  
        {  
            result += str[i];  
        }  
    }  
    Console.WriteLine(result);  
}
```

## Positive integer is a prime number or not

```ps1
input: 20, output: Not Prime
input: 17, output: Prime
```

```c#
internal static bool FindPrime(int number)  
{  
    if (number == 1) return false;  
    if (number == 2) return true;  
    if (number % 2 == 0) return false;  

    var squareRoot = (int)Math.Floor(Math.Sqrt(number));  

    for (int i = 3; i <= squareRoot; i += 2)  
    {  
        if (number % i == 0) return false;  
    }  
    return true;  
}
```

## Bubble Sort Algorithm In C#

## Quick Sort Algorithm In C#

## Merge Sort Algorithm In C#

## Insertion Sort Algorithm In C#

## Binary Search In C#
