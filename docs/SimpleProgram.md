# Coding Programs

## Strings

### Reverse a string

```text
Input: hello        Output: olleh
Input: hello world  Output: dlrow olleh
```

```csharp
public static void ReverseString(string str)
{
    char[] charArray = str.ToCharArray();
    for (int i = 0, j = str.Length - 1; i < j; i++, j--)
    {
        charArray[i] = str[j];
        charArray[j] = str[i];
    }
    string reversedString = new string(charArray);
    Console.WriteLine(reversedString);
}
```

### Reverse the order of words in a string

```text
Input: Welcome to hello world  Output: world hello to Welcome
```

```csharp
public static void ReverseWordOrder(string str)
{
    int i;
    StringBuilder reverseSentence = new StringBuilder();

    int start = str.Length - 1;
    int end = str.Length - 1;

    while (start > 0)
    {
        if (str[start] == ' ')
        {
            i = start + 1;
            while (i <= end)
            {
                reverseSentence.Append(str[i]);
                i++;
            }
            reverseSentence.Append(' ');
            end = start - 1;
        }
        start--;
    }

    for (i = 0; i <= end; i++)
    {
        reverseSentence.Append(str[i]);
    }
    Console.WriteLine(reverseSentence.ToString());
}
```

### Reverse each word in a string

```text
Input: Welcome to hello world  Output: emocleW ot olleh dlrow
```

```csharp
public static void ReverseWords(string str)
{
    StringBuilder output = new StringBuilder();
    List<char> charList = new List<char>();

    for (int i = 0; i < str.Length; i++)
    {
        if (str[i] == ' ' || i == str.Length - 1)
        {
            if (i == str.Length - 1)
                charList.Add(str[i]);

            for (int j = charList.Count - 1; j >= 0; j--)
                output.Append(charList[j]);

            output.Append(' ');
            charList = new List<char>();
        }
        else
        {
            charList.Add(str[i]);
        }
    }
    Console.WriteLine(output.ToString());
}
```

### Check whether a string is a palindrome

```text
Input: madam            Output: Palindrome
Input: step on no pets  Output: Palindrome
Input: book             Output: Not Palindrome
```

```csharp
public static void CheckPalindrome(string str)
{
    bool isPalindrome = true;
    for (int i = 0, j = str.Length - 1; i < j; i++, j--)
    {
        if (str[i] != str[j])
        {
            isPalindrome = false;
            break;
        }
    }

    Console.WriteLine(isPalindrome ? "Palindrome" : "Not Palindrome");
}
```

### Count the occurrences of each character in a string

```text
Input: hello world
Output:
h - 1
e - 1
l - 3
o - 2
w - 1
r - 1
d - 1
```

```csharp
public static void CountCharacter(string str)
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

### Remove duplicate characters from a string

```text
Input: helloworld  Output: helowrd
```

```csharp
public static void RemoveDuplicate(string str)
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

## Numbers

### Check whether a number is prime

```text
Input: 20  Output: Not Prime
Input: 17  Output: Prime
```

```csharp
public static bool IsPrime(int number)
{
    if (number <= 1) return false;
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

### Find the factorial of a number

```text
Input: 5  Output: 120
```

```csharp
public static long Factorial(int number)
{
    if (number == 0)
    {
        return 1;
    }

    return number * Factorial(number - 1);
}
```

### Print the Fibonacci series

```text
Input: 8  Output: 0 1 1 2 3 5 8 13
```

```csharp
public static void Fibonacci(int count)
{
    int first = 0, second = 1;

    for (int i = 0; i < count; i++)
    {
        Console.Write(first + " ");
        int next = first + second;
        first = second;
        second = next;
    }
}
```

### Reverse a number

```text
Input: 12345  Output: 54321
```

```csharp
public static int ReverseNumber(int number)
{
    int reversed = 0;

    while (number > 0)
    {
        reversed = reversed * 10 + number % 10;
        number /= 10;
    }
    return reversed;
}
```

### Check whether a number is a palindrome

```text
Input: 121  Output: Palindrome
Input: 123  Output: Not Palindrome
```

```csharp
public static bool IsPalindromeNumber(int number)
{
    return number == ReverseNumber(number);
}
```

### Check whether a number is an Armstrong number

An Armstrong number equals the sum of its digits, each raised to the power of the number of digits.

```text
Input: 153  Output: Armstrong (1³ + 5³ + 3³ = 153)
Input: 123  Output: Not Armstrong
```

```csharp
public static bool IsArmstrong(int number)
{
    int digits = number.ToString().Length;
    int sum = 0;
    int temp = number;

    while (temp > 0)
    {
        int digit = temp % 10;
        sum += (int)Math.Pow(digit, digits);
        temp /= 10;
    }
    return sum == number;
}
```

### Convert numbers to words

```text
Input: 1234  Output: One Thousand Two Hundred And Thirty Four
```

```csharp
private static string[] units = { "Zero", "One", "Two", "Three",
    "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
    "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen" };

private static string[] tens = { "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };

public static string Convert(int i)
{
    if (i < 20)
    {
        return units[i];
    }
    if (i < 100)
    {
        return tens[i / 10] + ((i % 10 > 0) ? " " + Convert(i % 10) : "");
    }
    if (i < 1000)
    {
        return units[i / 100] + " Hundred"
                + ((i % 100 > 0) ? " And " + Convert(i % 100) : "");
    }
    if (i < 100000)
    {
        return Convert(i / 1000) + " Thousand"
                + ((i % 1000 > 0) ? " " + Convert(i % 1000) : "");
    }
    if (i < 10000000)
    {
        return Convert(i / 100000) + " Lakh"
                + ((i % 100000 > 0) ? " " + Convert(i % 100000) : "");
    }
    if (i < 1000000000)
    {
        return Convert(i / 10000000) + " Crore"
                + ((i % 10000000 > 0) ? " " + Convert(i % 10000000) : "");
    }
    return Convert(i / 1000000000) + " Arab"
            + ((i % 1000000000 > 0) ? " " + Convert(i % 1000000000) : "");
}
```

## Arrays

### Product of array except self

Return an array where each element is the product of all the other elements.

```text
Input:  [1, 2, 3, 4, 5]
Output: [120, 60, 40, 30, 24]

2 * 3 * 4 * 5 = 120
1 * 3 * 4 * 5 = 60
1 * 2 * 4 * 5 = 40
...
```

Without division, in O(n): multiply the product of everything to the left by the product of everything to the right.

```csharp
public static int[] ProductExceptSelf(int[] nums)
{
    int n = nums.Length;
    int[] result = new int[n];

    // Product of all elements to the left of i
    result[0] = 1;
    for (int i = 1; i < n; i++)
    {
        result[i] = result[i - 1] * nums[i - 1];
    }

    // Multiply by the product of all elements to the right of i
    int right = 1;
    for (int i = n - 1; i >= 0; i--)
    {
        result[i] *= right;
        right *= nums[i];
    }
    return result;
}
```

## Sorting and searching

### Bubble sort

Repeatedly swaps adjacent elements that are in the wrong order. Time complexity: O(n²).

```csharp
public static void BubbleSort(int[] arr)
{
    for (int i = 0; i < arr.Length - 1; i++)
    {
        bool swapped = false;
        for (int j = 0; j < arr.Length - 1 - i; j++)
        {
            if (arr[j] > arr[j + 1])
            {
                (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);
                swapped = true;
            }
        }

        // Already sorted
        if (!swapped) break;
    }
}
```

### Insertion sort

Builds the sorted array one element at a time, inserting each element into its correct position. Time complexity: O(n²), but fast for small or nearly sorted arrays.

```csharp
public static void InsertionSort(int[] arr)
{
    for (int i = 1; i < arr.Length; i++)
    {
        int key = arr[i];
        int j = i - 1;

        while (j >= 0 && arr[j] > key)
        {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

### Quick sort

Picks a pivot, partitions the array so smaller elements are on the left and larger on the right, then sorts each side recursively. Average time complexity: O(n log n).

```csharp
public static void QuickSort(int[] arr, int low, int high)
{
    if (low < high)
    {
        int pivotIndex = Partition(arr, low, high);
        QuickSort(arr, low, pivotIndex - 1);
        QuickSort(arr, pivotIndex + 1, high);
    }
}

private static int Partition(int[] arr, int low, int high)
{
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++)
    {
        if (arr[j] < pivot)
        {
            i++;
            (arr[i], arr[j]) = (arr[j], arr[i]);
        }
    }
    (arr[i + 1], arr[high]) = (arr[high], arr[i + 1]);
    return i + 1;
}
```

### Merge sort

Splits the array in half, sorts each half recursively, then merges the two sorted halves. Time complexity: O(n log n).

```csharp
public static void MergeSort(int[] arr, int left, int right)
{
    if (left < right)
    {
        int mid = (left + right) / 2;
        MergeSort(arr, left, mid);
        MergeSort(arr, mid + 1, right);
        Merge(arr, left, mid, right);
    }
}

private static void Merge(int[] arr, int left, int mid, int right)
{
    int[] leftArray = arr[left..(mid + 1)];
    int[] rightArray = arr[(mid + 1)..(right + 1)];

    int i = 0, j = 0, k = left;

    while (i < leftArray.Length && j < rightArray.Length)
    {
        arr[k++] = leftArray[i] <= rightArray[j] ? leftArray[i++] : rightArray[j++];
    }

    while (i < leftArray.Length) arr[k++] = leftArray[i++];
    while (j < rightArray.Length) arr[k++] = rightArray[j++];
}
```

### Binary search

Searches a **sorted** array by repeatedly halving the search range. Time complexity: O(log n).

```csharp
public static int BinarySearch(int[] arr, int target)
{
    int low = 0, high = arr.Length - 1;

    while (low <= high)
    {
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) return mid;

        if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }

    // Not found
    return -1;
}
```
