---
title: Bash Shell
description: Write your first bash shell script
weight: 15
lastmod: 2024-06-20T11:11:30-09:00
draft: false
vimeo: 973161648
emoji: 🐚
video_length: 2:27
quiz: true
---

<quiz-modal options="1 2 3 4 5 a b c:1a 1b 1c 2a 2b 2c 3a 3b 3c 4a 4b 4c 5a 5b 5c:{1..5}{a,b,c}:error" answer="1a 1b 1c 2a 2b 2c 3a 3b 3c 4a 4b 4c 5a 5b 5c" prize="6">
  <h6>What is the output of the following Bash command?</h6>  
  <p><code>echo {1..5}{a,b,c}</code></p>
</quiz-modal>


## Bash Script Example

Here's an of the basic syntax in a bash script:

{{< file "cog" "app.sh" >}}
```bash
#!/bin/bash

# Define variables
name="Jeff"

# Print a message
echo "Hello, $name!"

# Read user input for age
echo "Enter your age:"
read age

# Conditional statement
if [ $age -ge 18 ]; then
    echo "You are an adult."
else
    echo "You are a minor."
fi

# Loop through numbers 1 to 5
for i in {1..5}; do
    echo "Number: $i"
done

# Function to greet a person
greet() {
    local greeting="Hello, $1!"
    echo $greeting
}

# Call the greet function
greet "Alice"

# Read user input for favorite color
echo "Enter your favorite color:"
read color
echo "Your favorite color is: $color"

# Check the exit status of a command
ls /non/existent/directory
if [ $? -eq 0 ]; then
    echo "Command succeeded."
else
    echo "Command failed."
fi
```

## Bonus Video 

<div class="vid-center">
{{< youtube 6gOQbmRk52aq_YLT >}}
</div>
