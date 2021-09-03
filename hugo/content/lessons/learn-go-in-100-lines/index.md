---
title: Learn Go in 100 Lines
lastmod: 2021-08-28T07:27:03-07:00
publishdate: 2021-08-28T07:27:03-07:00
author: Alex Guja
draft: false
description: An introduction to Go
tags: 
    - go

# youtube: f0DrPLKf6Ro
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---


## Introduction

[Go](https://en.wikipedia.org/wiki/Go_(programming_language)) is an open-source programming language developed at Google by Robert Griesemer, Rob Pike, and Ken Thompson. It is often described as "C for the 21st century", however, it borrows important ideas from several other languages like ALGOL, Pascal, Modula-2, Oberon, CSP, and others. At its core, Go relies on simplicity, reliability, and efficiency to overcome the shortcomings of its ancestors. Go has garbage collection, a package system, first-class functions, lexical scope, immutable strings that rely on UTF-8, and an awesome concurrency model.

As a compiled language, Go is generally faster than interpreted languages and is safer from crashes thanks to its built-in type system. That being said, there is a good balance between expressiveness and safety that gives programmers the benefits of a strong type system without the burden of complex workflows.

The use cases of the language vary from network servers and distributed systems to CLI’s, web and mobile development, scalable databases, and cloud-native applications.

## First Program
Before we get started, check out this [guide](https://golang.org/doc/install) to download and install Go on your platform. We’ll start with the classic “hello world”. Despite being a simple example, it already illustrates many central ideas.

{{< file "go" "hello_world.go" >}}
{{< highlight "go" >}}
package main // Required for a standalone executable.

import "fmt" // fmt implements formatted I/O.

/* When this program is executed the first function that runs is main.main() */
func main() {
	fmt.Println("Hello, world") // Call Println() from the fmt package.
}
{{< /highlight >}}

The first thing to note is that every Go program is organized in a *package*. A package is just a collection of source files in the same directory that allows variables, types, and functions to be visible among other source files within the same package. For standalone files, the package is called <code>main</code>, but the name of the file is decided by the programmer.

Next, we import the <code>"fmt"</code> package that implements formatted I/O. We'll use the <code>fmt.Println()</code> function to write default formats to standard output and <code>fmt.Printf()</code> when we need more flexibility over the formats.

Lastly, in the body of the <code>main</code> function, we make a call to <code>fmt.Println()</code>  that displays the passed argument in the output.
Note that the <code>main</code> function takes no arguments and doesn't return any values. Similar to the <code>main</code> package, the <code>main</code> function is a requirement for standalone files.

To run the program, we need to compile the source code and its dependencies into an executable binary. We achieve this by opening a command line in the directory of our package and running
the <code>go</code> command with the <code>build</code> subcommand, followed by the name of the source file.

{{< file "terminal" "command line" >}}
{{< highlight text >}}

$ go build hello_world.go
{{< /highlight >}}

To execute the binary, type <code>./</code> followed by the name of the binary file.
{{< file "terminal" "command line" >}}
{{< highlight text >}}
$ ./hello_world

# output
Hello, world
{{< /highlight >}}

Another option is to use the <code>go</code> command with the <code>run</code> subcommand, followed by the name of the source file. This will combine the two steps outlined above and produce the same result, however, no executable will be saved in the working directory. This method is mostly used for one-off snippets and experimental code that is unlikely to be needed in the future.

{{< file "terminal" "command line" >}}
{{< highlight text >}}

$ go run helloworld.go

# output
Hello, world
{{< /highlight >}}

## Basics in 100 Lines

In the following 100 lines of code, we'll go through several examples illustrating Go's features. We'll cover how to declare variables, understand Go's built-in types, work with arrays and slices, cover maps, and touch on the flow of control. From there, we'll go beyond 100 lines and also look at pointers, structs, and Go's built-in support for concurrency.

### Variables
When writing Go programs, variables must be declared before they can be used. The example below shows how to declare single variables or a group of variables. In the interest of space, the output is displayed as an in-line comment.

{{< file "go" "variables.go" >}}
{{< highlight "go" >}}
package main

import "fmt"

/* Declare a single variable */
var a int

/* Declare a group of variables */
var (
    b bool
    c float32
    d string
)

func main() {
	a = 42                  // Assign single value
	b, c = true, 32.0       // Assign multiple values
	d = "string"            // Strings must contain double quotes
	fmt.Println(a, b, c, d) // 42 true 32 string
}


{{< /highlight >}}

Notice how each variable declaration is followed by the type of that variable. Before we cover types in the next section, note that we can replace the <code>var</code> keyword with <code>const</code> when we need to introduce constants in our code.


When declaring variables, another option is to use the <code>:=</code> operator to initialize and assign to variables in one go. This is called a *short variable declaration*. Let's refactor the code above to illustrate this.


{{< file "go" "variables_refactored.go" >}}
{{< highlight "go" >}}
package main

import "fmt"

func main() {
	a := 42            // Initialize and assign to a single variable
	b, c := true, 32.0 // Initialize and assign to multiple variables
	d := "string"
	fmt.Println(a, b, c, d) // 42 true 32 string
}

{{< /highlight >}}
The short variable declaration makes our code neater, so we'll see it again throughout this lesson.

### Types
Go offers a rich collection of types, including numericas, booleans, strings, error, and the ability to create custom types. Strings are are a sequence of UTF-8 characters enclosed in double-quotes. Numerical types are the most versatile, with 8, 16, 32, and 64-bit variants for both signed (<code>int</code>) and unsigned (<code>uint</code>) integers.

A <code>byte</code> is an alias for <code>uint8</code>. A <code>rune</code> is an alias for <code>int32</code>. Floats (or floating-point numbers) are either <code>float32</code> or <code>float64</code>. Complex numbers are also supported and can be represented as  <code>complex128</code> or <code>complex64</code>.

When a variable is declared it is assigned to the natural "null" value of the corresponding type. For example, in <code>var k int</code>, <code>k</code> has the value 0. 
In <code>var s string</code>, <code>s</code> has the value <code>""</code>. The example below shows the difference between user-specified types and the default types assigned with a short variable declaration.


{{< file "go" "types.go" >}}
{{< highlight "go" >}}
package main

import "fmt"

func main() {
        /* User specified types */
        const a int32 = 12         // 32-bit integer
        const b float32 = 20.5      // 32-bit float
        var c complex128 = 1 + 4i  // 128-bit complex number
        var d uint16 = 14          // 16-bit unsigned integer

        /* Default types */
        n := 42              // int
        pi := 3.14           // float64
        x, y := true, false  // bool
        z := "Go is awesome" // string

        fmt.Printf("user-specified types:\n %T %T %T %T\n", a, b, c, d)
        fmt.Printf("default types:\n %T %T %T %T %T\n", n, pi, x, y, z)
}

{{< /highlight >}}

Notice the <code>%T</code> conversion character in the first argument of <code>fmt.Printf()</code>. In Go, this is called a *verb*, and it stands for the *type* of the passed variable. <code>\n</code> introduces a new line at the end of the output. <code>fmt.Printf()</code> has many other verbs, including <code>%d</code> for decimal integers, <code>%s</code> for strings, <code>%f</code> for floats, <code>%t</code> for booleans, and <code>%v</code> for any natural value for a type. 

Another thing to note is that <code>int</code> is an alias for either <code>int32</code> or <code>int64</code>, depending on the underlying system.
Let's run the code example to see the types and the formatting verbs in action.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
$ go run types.go

# output
user-specified types:
 int32 float32 complex128 uint16

default types:
 int float64 bool bool string
{{< /highlight >}}



### Arrays

Storing a number of elements in a list can be achieved using arrays, slices, and maps (Go's version of hash-maps). We'll consider all three in the examples below. Arrays are defined by their fixed size and a common data type for all elements. Interestingly, the size of the array is part of the type, meaning arrays cannot grow or shrink, otherwise, they would have a different type. Array elements are accessed using square brackets. The example below shows how to declare an array containing strings and how to loop through its elements.

{{< file "go" "arrays.go" >}}
{{< highlight "go" >}}
package main

import "fmt"

func main() {
	/* Define an array of size 4 that stores deployment options */
	var DeploymentOptions = [4]string{"R-pi", "AWS", "GCP", "Azure"}

	/* Loop through the deployment options array */
	for i := 0; i < len(DeploymentOptions); i++ {
		option := DeploymentOptions[i]
		fmt.Println(i, option)
	}
}

{{< /highlight >}}

Notice the lack of parentheses around the looping condition. In this example, we traverse the array outputting the current index and the value stored at that index. Running the code produces the following output.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
$ go run arrays.go

# output
0 R-pi
1 AWS
2 GCP
3 Azure
{{< /highlight >}}

Before we move on, let’s try a neater way to write the <code>for</code> loop in the example above.
We can make use of the <code>range</code> keyword to achieve the same behavior with less code. Both versions of the code produce the same output.

{{< file "go" "arrays_refactored.go" >}}
{{< highlight "go" >}}
package main

import "fmt"

func main() {
	/* Define an array and let the compiler count its size */
	DeploymentOptions := [...]string{"R-pi", "AWS", "GCP", "Azure"}

	/* Loop through the deployment options array */
	for index, option := range DeploymentOptions {
		fmt.Println(index, option)
	}
}

{{< /highlight >}}

### Slices

Slices can be thought of as *dynamic* arrays. Slices always refer to an underlying array and can grow when new elements are added. The number of elements that are visible through a slice determines its length. If a slice has an underlying array that is larger, the slice may still have the *capacity* to grow. When it comes to slices, think of the length as the *current* number of elements, and think of the capacity as the *maximum* number of elements that can be stored. Let's see an example.

{{< file "go" "slices.go" >}}
{{< highlight "go" >}}
package main

import "fmt"

func main() {
	/* Define an array containing programming languages */
	languages := [9]string{
		"C", "Lisp", "C++", "Java", "Python",
		"JavaScript", "Ruby", "Go", "Rust", // Must include the trailing comma
	}

	/* Define slices */
	classics := languages[0:3]  // alternatively languages[:3]
	modern := make([]string, 4) // len(modern) = 4
	modern = languages[3:7]     // include 3 exclude 7
	new := languages[7:9]       // alternatively languages[7:]

	fmt.Printf("classic languagues: %v\n", classics) // classic languagues: [C Lisp C++]
	fmt.Printf("modern languages: %v\n", modern)     // modern languages: [Java Python JavaScript Ruby]
	fmt.Printf("new languages: %v\n", new)           // new languages: [Go Rust]
}

{{< /highlight >}}

Note that when defining a slice, the last index is excluded. In other words, a slice <code>s := a[i:j]</code> will include all the elements from <code>a[i]</code> to <code>a[j - 1]</code> but not <code>a[j]</code>. In the next example, we continue exploring the behavior of slices. Let's pretend we're editing the same file and the above code is still available (instead of the <code>--snip--</code> comment).

{{< file "go" "slices.go" >}}
{{< highlight "go" >}}
package main

import (
    "fmt"
    "reflect"
)

func main() {
        // -- snip -- //
        allLangs := languages[:]                      // copy of the array
        fmt.Println(reflect.TypeOf(allLangs).Kind())   // slice

        /* Create a slice containing web frameworks */
        frameworks := []string{
            "React", "Vue", "Angular", "Svelte",
            "Laravel", "Django", "Flask", "Fiber",
        }

        jsFrameworks := frameworks[0:4:4]          // length 4 capacity 4
        frameworks = append(frameworks, "Meteor")  // not possible with arrays

        fmt.Printf("all frameworks: %v\n", frameworks)
        fmt.Printf("js frameworks: %v\n", jsFrameworks)
}


{{< /highlight >}}

First, we make a copy of the <code>languages</code> array using the <code>[:]</code> operator. The resulting copy is a slice. We assert that's the case using the <code>"reflect"</code> package. Next, we create a slice called <code>frameworks</code>. Notice the blank entry in the square brackets responsible for the size. If we pass a parameter inside these brackets we are creating an array. Leaving it blank creates a slice. From there, we create another slice called <code>jsFrameworks</code> that selects JavaScript frameworks. Finally, we extend our <code>frameworks</code> slice by adding Meteor to the list of frameworks.

The <code>append</code> function pushes new values to the end of a slice and returns a new slice with the same type as the original. In case the capacity of a slice is insufficient to store the new element, a new slice is created that can fit all the elements. In that case, the returned slice will refer to a different underlying array. Running the above code leads to the output below.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
$ go run slices.go

# output
...
all frameworks: [React Vue Angular Svelte Laravel Django Flask Fiber Meteor]
js frameworks: [React Vue Angular Svelte]
{{< /highlight >}}

### Maps
Most modern programming languages have a built-in implementation of a hash-map. For example, think of Python's dictionary or JavaScript's object. Fundamentally, a map is a data structure that stores key-value pairs with a constant look-up time. The efficiency of maps comes at the expense of randomizing the order of the keys and the associated values. In other words, we make no guarantees about the order of the elements in a map. The example below showcases this behavior. 

{{< file "go" "maps.go" >}}
{{< highlight "go" >}}
package main

import "fmt"

func main() {
	/* Define a map containing the release year of several languages */
	firstReleases := map[string]int{
		"C": 1972, "C++": 1985, "Java": 1996,
		"Python": 1991, "JavaScript": 1996, "Go": 2012,
	}

	/* Loop through each entry and output the name and release year */
	for k, v := range firstReleases {
		fmt.Printf("%s was first released in %d\n", k, v)
	}
}

{{< /highlight >}}


We define a map called <code>firstReleases</code> containing several programming languages as the keys, and their release years as the corresponding values. We also write a loop to traverse the map and output each key-value pair. If we run the code, notice the random order of the elements displayed in the output.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
$ go run maps.go

# output
Go was first released in 2012
C was first released in 1972
C++ was first released in 1985
Java was first released in 1996
Python was first released in 1991
JavaScript was first released in 1996
{{< /highlight >}}

### Control Flow
To wrap things up, we will consider the following scenario: Let's suppose we're given a slice containing floats, and we're interested in computing their average value. We'll proceed by creating a function called <code>average</code> that takes a slice as a parameter and returns a float called <code>avg</code>. The example below shows a possible implementation.

{{< file "go" "control_flow.go" >}}
{{< highlight "go" >}}

package main

import "fmt"

/* Define a function to find the average of the floats contained in a slice */
func average(x []float64) (avg float64) {
	total := 0.0
	if len(x) == 0 {
		avg = 0
	} else {
		for _, v := range x {
			total += v
		}
		avg = total / float64(len(x))
	}
	return
}

func main() {
	x := []float64{2.15, 3.14, 42.0, 29.5}
	fmt.Println(average(x))   // 19.197499999999998
}

{{< /highlight >}}

We define an input slice called <code>x</code> in the body of the <code>main</code> function and we make a call to <code>average</code>, passing in <code>x</code> as an argument. We wrap the call inside <code>fmt.Println()</code> to write the result to standard output.
The interesting part is the implementation of the <code>average</code> function. Notice the return parameter <code>avg</code> is defined immediately at end of the function declaration. In the function body, we initialize a variable named <code>total</code> that will compute a running sum of the slice elements. From there, we check the size of the input slice. If the slice is empty, we return 0, otherwise, we loop through each element in the slice and add it to the total. Notice how we use the underscore (<code>_</code>) for the unused variable. We convert the length of the slice to a float using <code>float64(len(x))</code>. Finally, we compute the average and return the result to the caller.


Now that we've seen the classic <code>if-else</code> statements, let's introduce Go's <code>switch</code> statements. We'll refactor our <code>average</code> function to make use of the <code>switch</code> syntax. 

{{< file "go" "switch_cases.go" >}}
{{< highlight "go" >}}

package main

import "fmt"

func average(x []float64) (avg float64) {
	total := 0.0
	switch len(x) {
	case 0:
		avg = 0
	default:
		for _, v := range x {
			total += v
		}
		avg = total / float64(len(x))
	}
	return
}

func main() {
	x := []float64{2.15, 3.14, 42.0, 29.5}
	fmt.Println(average(x)) // 19.197499999999998
}

{{< /highlight >}}

 Traditionally, the built-in switch statements in modern languages were designed to work with constants. In Go, we are allowed to use variables. We use the <code>switch</code> keyword followed by the variable of interest - in this case <code>len(x)</code>. From there, we define two cases inside curly braces, which are evaluated from top to bottom until a case succeeds. In contrast to other languages, Go runs the selected case only, thus removing the need to <code>break</code>. Another cool feature is that the variables in the switch statement are not restricted to integers.

 The last thing we'll mention on this topic is Go's implementation of a <code>while</code> loop. In Go, there is no <code>while</code> keyword. Instead, we use the <code>for</code> keyword followed by a condition and a loop body. The only exception is the missing semicolon at the end of the condition. Let's see an example.

{{< file "go" "while_loop.go" >}}
{{< highlight "go" >}}
package main

import "fmt"

func main() {
	count := 1
	for count < 5 {
		count += count
	}
	fmt.Println(count) // 8
}
{{< /highlight >}}

Congratulations for making it this far! Now it's time to have a break 
⏱️ (or another cup of coffee 
☕) before we dive into the bonus section 🎁 .

## Beyond 100 Lines
In this section, we'll go beyond the basics and explore three more examples related to pointers, structs, and concurrency.

### Structs and pointers
Before we begin discussing structs and user-defined types, we have to cover pointers. The good news is that pointer arithmetic is not allowed in Go, which eliminates dangerous/unpredictable behavior. A *pointer* stores the memory address of a value. In Go, the type <code>*T</code> is a pointer to a <code>T</code> value. The default value for pointers is <code>nil</code>. Let's go through an example.

{{< file "go" "pointers.go" >}}
{{< highlight "go" >}}
package main

import "fmt"

func main() {
	var address *int  // declare an int pointer
	number := 42      // int
	address = &number // address stores the memory address of number
	value := *address // dereferencing the value 

	fmt.Printf("address: %v\n", address) // address: 0xc0000ae008
	fmt.Printf("value: %v\n", value)     // value: 42
}


{{< /highlight >}}

When working with pointers there are two important symbols to be aware of. The address operator (<code>&</code>) provides the *memory address* of a value. It is used to bind a pointer to a value. The asterisk operator (<code>*</code>) prefixing a type denotes a pointer type, whereas an asterisk prefixing a variable is used to *dereference* the value the variable points to. If you're new to pointers, they may take some getting used to, however, we don't need to dive too deep at this point. Once you feel confident with the example above, you're all set for the rest of this lesson. 

For the next part, we'll switch gears and cover how to use a <code>struct</code> to define a custom type.
A <code>struct</code> is simply a collection of fields. In the next example, we'll use what we've learned about pointers, learn how to use a struct, and build a stack from scratch.

{{< file "go" "structs.go" >}}
{{< highlight "go" >}}
package main

import "fmt"

/* Define a stack type using a struct */
type stack struct {
	index int
	data  [5]int
}

/* Define push and pop methods */
func (s *stack) push(k int) {
	s.data[s.index] = k
	s.index++
}

/* Notice the stack pointer s passed as an argument */
func (s *stack) pop() int {
	s.index--
	return s.data[s.index]
}

func main() {
	/* Create a pointer to the new stack and push 2 values */
	s := new(stack)
	s.push(23)
	s.push(14)
	fmt.Printf("stack: %v\n", *s) // stack: {2 [23 14 0 0 0]}
}


{{< /highlight >}}

First, we define our custom type that represents a stack. To achieve the stack functionality, we need an array to store
the stack elements, and an index to point to the last item in the stack. For the sake of the example, let's fix our stack size to 5 elements. Inside the body of the struct, we specify an index field which is of type int, and a field called data, which is an array of 5 int elements.

Next we define the <code>push</code> and <code>pop</code> methods. A method is a special kind of function that takes a receiver argument between the <code>func</code> keyword and the method name. Notice the type of the parameter <code>s</code>. In this case, it is a stack pointer instead of a stack. By default, Go doesn't pass values by reference. Instead, if we were to omit the asterisk, Go would pass a copy of our stack, meaning the original stack would not be modified by our methods.

In the body of our stack methods, we access the stack fields using the dot notation. In the <code>push</code> method, we write a given integer <code>k</code> to the first available index (recall the default value of a declared int is 0), and increment the index by 1. In the <code>pop</code> method we decrement the index by 1, and return the last item in the stack. In the body of the <code>main</code> function, we use <code>new()</code> to create a pointer to a newly allocated stack. We then push 2 items and write the result to standard output.

### Concurrency
We'll wrap things up by considering one more example related to concurrency. We'll introduce *goroutines* which are Go's version of threads.
If you're new to threads, they are nothing but a sequential control flow in a program. Things get interesting when multiple threads are run in parallel so that a program can make use of multiple CPU cores. Goroutines are initiated using the <code>go</code> keyword. In addition to goroutines, Go has built-in *channels* which are used to share data between goroutines. In general, send and receive operations across a channel block the execution until the other side is ready.

In the example below, we'll consider 5 goroutines that run in parallel. Let's suppose we organize a cooking contest between 5 gopher chefs. This is a timed contest and whoever finishes their dish first wins. Let's see how we can simulate this contest using Go's concurrency features.

{{< file "go" "concurrency.go" >}}
{{< highlight "go" >}}
package main

import (
	"fmt"
)

func main() {
	c := make(chan int) // Create a channel to pass ints
	for i := 0; i < 5; i++ {
		go cookingGopher(i, c) // Start a goroutine
	}

	for i := 0; i < 5; i++ {
		gopherID := <-c // Receive a value from a channel
		fmt.Println("gopher", gopherID, "finished the dish")
	} // All goroutines are finished at this point
}

/* Notice the channel as an argument */
func cookingGopher(id int, c chan int) {
	fmt.Println("gopher", id, "started cooking")
	c <- id // Send a value back to main
}


{{< /highlight >}}

First, we create a channel that will be common to all goroutines. Then we start 5 goroutines and pass the channel as an argument. Inside each goroutine, we write the gopher id to standard output as soon the gopher starts cooking the dish. We then send the gopher id from the goroutine back to the caller. From there, we're back to the body of the main function where we receive the gopher id and record their finishing time.


Since we're dealing with concurrent code, we lose the ability to predict the order of the output, however, we can observe how the channel blocks the execution, as a goroutine has to wait until the channel is available before it can send an id. One possible output is included below. Keep in mind that we're probably using more goroutines than the number of cores on our machine, hence it's likely that a single core is time-multiplexed to simulate the concurrency.

{{< file "terminal" "command line" >}}
{{< highlight text >}}
$ go run concurrency.go

# output
gopher 0 started cooking
gopher 4 started cooking
gopher 3 started cooking
gopher 0 finished the dish
gopher 2 started cooking
gopher 1 started cooking
gopher 4 finished the dish
gopher 3 finished the dish
gopher 2 finished the dish
gopher 1 finished the dish
{{< /highlight >}}

If you've made it to the end, congratulations! Hopefully, you had a lot of fun along the way. If you'd like to see more, check out Go's official [tour](https://tour.golang.org/list) which gives you a concise overview of the language. If you enjoyed this article, consider becoming a pro member at [fireship.io](https://fireship.io/pro/) and stay tuned for more content.