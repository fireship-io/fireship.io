---
title: "Code This, Not That - Python Edition"
lastmod: 2022-02-20T15:31:36+01:00
publishdate: 2022-02-20T15:31:36+01:00
author: Alex Guja
draft: false
description: 10 Tips to make your code more Pythonic.
tags:
  - python
youtube: x7X9w_GIm1s
github: https://github.com/fireship-io/code-this-not-that-python-edition/tree/main/src
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

## Introduction

_Python_ is one of the most popular languages in the world. It has many practical applications including web development, desktop apps, IoT, data analysis, and machine learning. This lesson contains ten tips that will make your code more pythonic.

To make life simpler, we’ll use the following key to denote a few categories

- 💩 - code that you should avoid.
- 🤔 - code that is generally ok, but ignores built-in language features.
- 🐍 - code that is considered pythonic.
- 💡 - bonus tips.

## Null checks

A common scenario is checking that a variable isn't empty (or null) before use. In Python, _null_ is denoted by the keyword <code>None</code>. The two code snippets below produce identical results. However, Python supports a simplified null check using the <code>if</code> keyword followed by the name of a variable.

💡 _Bonus Tip_: Use <code>f-strings</code> for string formatting. Initiate an f-string by typing an _f_ immediately before a regular string <code>(f"...")</code>, and place variables inside curly braces. Python will format the result into a string containing the variables.

{{< file "python" "null_checks.py" >}}
```python
# Null check: OK version 🤔 - Explicit "if x is not None" ❌
n = 42
if n is not None:
    print(f"n exists and is equal to {n}")

# Pythonic version 🐍: Use simplified if ✅
if n:
    print(f"n exists and is equal to {n}")
```


## Included values
In this section, we need to check if a list <code>(L)</code> contains the value of a particular variable <code>(x)</code>.
One way to do this is by using a <code>for</code> loop to iterate over all elements and check for equality. Python provides a nice shortcut, using the <code>in</code> keyword.

{{< file "python" "contains.py" >}}
```python
# Check if a value is contained in a list
L = ["JavaScript", "Python", "Ruby", "PHP", "Rust"]
x = "Rust"

# OK version 🤔 - For loop and a equality check ❌
for i in range(len(L)):
    if x == L[i]:
        print(f"{x} is contained in the list")

# Pythonic version 🐍: Use "if x in L" ✅
if x in L:
    print(f"{x} is contained in the list")
```


## List Comprehensions
A common data processing pattern is to define an empty list and append values to it.
For example, let's assume we want to generate a list of square numbers in a certain range.
One way to do this is to define a list, and use a <code>for</code> loop to iterate over a range of values and append each value to the list.

Python provides a neat one-liner for this purpose, called a "list comprehension". To write a list comprehension, start with the expression you would normally pass to the <code>append</code> method. From there, write the <code>for</code> loop condition immediately after the initial expression. Lastly, put everything inside a pair of square brackets. Comprehensions can be used with dictionaries, sets, and generators, however, try to avoid them with complex expressions. Readability is key.

{{< file "python" "list_comprehension.py" >}}
```python
# OK version 🤔 - For loop and append ❌ 
squares = []
for num in range(12):
    squares.append(num ** 2)

# Pythonic version 🐍: Use a list comprehension ✅
squares = [num ** 2 for num in range(12)]

# Bonus Tip 💡: You can also use dictionary, set, and generator comprehensions
squares_dict = {num: num ** 2 for num in range(12)} # dictionary
squares_set = {num ** 2 for num in range(12)}       # set
squares_gen = (num ** 2 for num in range(12))       # generator

```


## Using Any/All

Speaking of one-liners, Python provides some built-in functions that can check conditions that apply to at least _one_ element, or _all_ elements in an iterable. To illustrate this, let's consider a simple example. Imagine we're interested to know if a list contains negative numbers. A naive way to check this is to use a combination of a <code>for</code> loop and a flag. A better way is to use the <code>any</code> function.


{{< file "python" "any.py" >}}
```python
# Checking for negative values in a list
nums = [1, 2, 3, 4, 5, -42, 6, 7, 8]

# Inefficinet way 🤔 - Using a for loop and a flag ❌
contains_neg = False # flag
for num in nums:
    if num < 0:
        contains_neg = True


# Pythonic way 🐍 - Using the built-in "any" function ✅
contains_neg = any(num < 0 for num in nums) # True

# Bonus Tip 💡: Python also has a built-in "all" function ✅
contains_neg = not all(num >= 0 for num in nums) # True

```

 - <code>any</code> - Returns True if a condition applies to any element of the iterable. If the iterable is empty, returns False. 
 - <code>all</code> - Returns True if a condition applies to  all elements of the iterable (or if the iterable is empty).
  
## Iterations

Python provides a nice syntax for iteration that many users tend to ignore. For example, when iterating over the values in a list, a common pattern is to use a <code>for</code> loop and an index. If we're only interested in the values, a neater way is to use a <code>for</code> loop and iterate _directly_ over the list elements. If we need to keep an index, a neater way is to use <code>enumerate</code>.

{{< file "python" "iterations.py" >}}
```python
# Iterating over a single list
L = ["a", "b", "c", "d"]

# OK version 🤔 - Index in range ❌ 
for i in range(len(L)):
    val = L[i]
    print(i, val)

# Pythonic version 🐍: Access elements directly ✅
for el in L:
    print(el)

# Pythonic version 🐍: Use enumerate if you need the index, value pair ✅
for i, val in enumerate(L):
    print(i, val)
```

💡 _Bonus Tip_: These ideas also apply when iterating over multiple lists. We can iterate directly over values in two collections
using <code>zip</code>. If an index is required, we can use a combination of <code>enumerate</code> and <code>zip</code>.

{{< file "python" "iterations.py" >}}
```python
# Bonus Tip 💡:  Iterating over multiple lists
A = ["a", "b", "c", "d"]
B = ["e", "f", "g", "h"]

# OK version 🤔 - Index in range ❌ 
for i in range(len(A)):
    va, vb = A[i], B[i]
    print(i, va, vb)

# Pythonic version 🐍: Use zip to get the values ✅
for va, vb in zip(A, B):
    print(va, vb)

# Pythonic version 🐍: Use a combination of zip and enumerate to get the index and the values ✅
for i, (va, vb) in enumerate(zip(A, B)):
    print(i, va, vb)
```

## Tuple Unpacking
Another useful thing to know is how to unpack values directly from a tuple. One way is to access each element using indices. 
A more efficient way is to unpack the elements directly.

{{< file "python" "existence.py" >}}
```python
# Tuple unpacking
some_tuple = (1, 2, 3)

# OK version 🤔 - Unpack elements by index ❌
x = some_tuple[0]
y = some_tuple[1]
z = some_tuple[2]


# Pythonic way 🐍 - Unpack elements directly ✅
x, y, z = some_tuple
```

## Ternary Operators
Python uses <code>if/elif/else</code> blocks for control flow. For example, consider the need to decide on the sign of a variable based on its value. The naive way is to use an <code>if/else</code> block to make the decision. A neater way to simplify this is by using a ternary operator.

{{< file "python" "ternary_operator.py" >}}
```python
# Assign a value based on a condition
a = 42

# OK version 🤔 - if/else blocks ❌ 
if a > 0:
    sign = "positive"
else:
    sign = "negative"

# Pythonic way 🐍 - Use a ternary operator ✅
sign = "positive" if (a > 0) else "negative" # parentheses are optional
```

## Generators
[_Generators_](https://docs.python.org/3/howto/functional.html#generators) are a powerful tool to save memory and improve performance. In general, they _yield_ one value at a time and can be iterated over multiple times. Let's imagine we're interested in the sum of the first 42 000 natural numbers. We could use a list comprehension to compute the values and call the built-in <code>sum</code> function. Building a list requires 351064 bytes. Using a generator reduces this value to 112 bytes. That's pretty awesome 🔥.

{{< file "python" "generators.py" >}}
```python
from sys import getsizeof 

# Inefficent way 💩: Using a list ❌
L = [n for n in range(42_000)]
sum(L) # 881979000 bytes
getsizeof(L) # 351064 bytes

# Efficient way 🔥: Use a generator ✅
G = (n for n in range(42_000))
sum(G) # 881979000 bytes
getsizeof(G) # 112 bytes
```

## Mutable Default Arguments
Python supports default values for function parameters. If a value for a parameter isn't passed during a function call, the specified default value is used. There is a danger associated with this if the default value is of a mutable type. For example, consider specifying an empty list as a default value. If the list is modified, the default value is modified _as well_. In most cases, this is not intended. To avoid it, we can set the default value to <code>None</code>. If no value is passed during the function call, we can ensure an empty list is created.

{{< file "python" "mutable_default_args.py" >}}
```python
# Mutable default arguments 💩:  Wrong way  ❌
def append_element(elem, L=[]):
    L.append(elem)
    return L

L1 = append_element(21) # [21]
L2 = append_element(42) # [21, 42] - Oops..


# Correct way 🔥: Use None ✅
def better_append(elem, L=None):
    if L is None:
        L = []
    L.append(elem)
    return L

L1 = better_append(21) # [21]
L2 = better_append(42) # [42]

```

## Context Managers
The last tip is to use a context manager to ensure that a resource is properly closed. Let's consider a simple example of writing to a text file.
In this case, the simple code will run just fine, however, if more complex logic is involved and an exception is raised during the write, the file won't be closed. Another common scenario is simply to forget to close the file. Using a context manager ensures the file will always be closed, regardless of any exception.

{{< file "python" "context_managers.py" >}}
```python
# Managing files - using open and f.close() ❌
f = open("file.txt", "w")
f.write("Hi mom!") 
f.close()

# Pythonic way 🐍 -  Use a context manager ✅
with open("file.txt", "w") as f:
    f.write("Hi mom!") 
```
