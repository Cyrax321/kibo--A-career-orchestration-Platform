export interface CourseLesson {
    id: string;
    title: string;
    content: string; // Markdown supported
    exampleCode?: string; // For "Try it Yourself"
    exercise?: {
        question: string;
        placeholder: string; // The code with ___
        solution: string; // The expected answer for the blank
        hint?: string;
        hints?: string[]; // Multiple hints for unlock system
    };
}

export interface CourseData {
    id: string;
    title: string;
    description: string;
    lessons: CourseLesson[];
}

export const pythonCourse: CourseData = {
    id: "python-beginner",
    title: "KIBO PYTHON COURSE",
    description: "Master Python the Kibo Way - Simple, Fast, & Effective.",
    lessons: [
        {
            id: "intro",
            title: "Module 1: Python Intro",
            content: `
# What is Python?
Python is a popular programming language created by Guido van Rossum. At Kibo, we use Python because it is the #1 language for placements and interviews.

It is used for:
* Building Kibo's backend servers,
* Data Science & AI,
* Automating daily tasks.

### Why Learn with Kibo?
* Kibo focuses on the syntax you actually need for interviews.
* Python has a simple syntax similar to English, making it the perfect "first language" for Kibo students.
      `,
            exampleCode: `print("I am a Kibo Coder!")`,
            exercise: {
                question: "Insert the missing part of the code below to output your Kibo status.",
                placeholder: `___("I love learning on Kibo")`,
                solution: "print",
                hints: [
                    "This function outputs text to the console.",
                    "It starts with the letter 'p'.",
                    "The function is `print(...)`."
                ]
            }
        },
        {
            id: "syntax",
            title: "Module 2: Python Syntax",
            content: `
# Execute Python Syntax
As a Kibo developer, you will often write scripts directly. Python syntax can be executed by writing directly in the Command Line.

### Python Indentation
Indentation refers to the spaces at the beginning of a code line.
**Kibo Pro Tip:** Python uses indentation to indicate a block of code. If you skip it, your code crashes!

\`\`\`python
if kibo_score > 90:
  print("You are a Kibo Master!")
\`\`\`

**Another Indentation Example:**
\`\`\`python
def my_function():
  print("Inside function")
  if True:
    print("Inside if")
\`\`\`

**Error Example:**
\`\`\`python
if kibo_score > 90:
print("You are a Kibo Master!") # This will raise a syntax error
\`\`\`
      `,
            exampleCode: `if 5 > 2:
  print("Kibo rules!")`,
            exercise: {
                question: "Fix the code to reveal the success message:",
                placeholder: `if 5 > 2:
print("Kibo rules!")`,
                solution: `if 5 > 2:
  print("Kibo rules!")`,
                hints: [
                    "Python relies on indentation (spaces) to define blocks of code.",
                    "The `print` statement must be indented under the `if` statement.",
                    "Add 2 or 4 spaces before `print`."
                ]
            }
        },
        {
            id: "comments",
            title: "Module 3: Python Comments",
            content: `
# Comments
Comments explain your logic to other Kibo developers.
Comments prevent execution when testing your interview solutions.

### Creating a Comment
Comments start with a \`#\`. Python will ignore them, but your interviewer will love them.

\`\`\`python
# This logic calculates my Kibo Rank
print("Rank: Legend")
\`\`\`

**Inline Comment Example:**
\`\`\`python
x = 5 # This is an inline comment
\`\`\`

### Multiline Comments
To add a multiline comment (for complex Kibo algorithms), insert a \`#\` for each line:

\`\`\`python
# This script was
# written by a
# Kibo student
print("Hello, World!")
\`\`\`
      `,
            exampleCode: `# This logic calculates my Kibo Rank
print("Rank: Legend")`,
            exercise: {
                question: "Comments in Python are written with a special character, which one?",
                placeholder: `___ This is a comment`,
                solution: "#",
                hints: [
                    "Comments in Python start with a special character.",
                    "It's the same character used for hashtags on social media.",
                    "Use the `#` symbol."
                ]
            }
        },
        {
            id: "variables",
            title: "Module 4: Python Variables",
            content: `
# Variables
Variables are containers for storing your data values (like your Kibo XP).

### Creating Variables
A variable is created the moment you first assign a value to it.

\`\`\`python
kibo_xp = 1500
current_status = "Python Beginner"
print(kibo_xp)
print(current_status)
\`\`\`

**Multiple Assignment Example:**
\`\`\`python
x, y, z = "Orange", "Banana", "Cherry"
print(x)
print(y)
print(z)
\`\`\`

### Variable Names
A variable needs a descriptive name to be readable.
**Kibo Best Practice:** Use \`snake_case\` (e.g., \`kibo_student_name\`).
      `,
            exampleCode: `kibo_xp = 1500
current_status = "Python Beginner"
print(kibo_xp)
print(current_status)`,
            exercise: {
                question: "Create a variable named 'platform' and assign the value 'Kibo' to it.",
                placeholder: `___ = "Kibo"`,
                solution: "platform",
                hints: [
                    "Variables are created by assigning a value to a name.",
                    "The variable name is on the left side of the `=` operator.",
                    "The name is `platform`."
                ]
            }
        },
        {
            id: "data-types",
            title: "Module 5: Python Data Types",
            content: `
# Built-in Data Types
In programming, data type is an important concept.
Variables can store data of different types, and different types can do different things.

Python has the following data types built-in by default:
* **Text Type:**      \`str\` ("Kibo")
* **Numeric Types:**  \`int\` (100), \`float\` (99.9)
* **Sequence Types:** \`list\` (["Python", "Java"])
* **Mapping Type:**   \`dict\` ({"name": "Kibo", "rating": 5})
* **Boolean Type:**   \`bool\` (True)

### Getting the Data Type
You can get the data type of any object by using the \`type()\` function:

\`\`\`python
kibo_rating = 5
print(type(kibo_rating))
\`\`\`

**Example with Strings:**
\`\`\`python
x = "Hello World"
print(type(x))
\`\`\`
      `,
            exampleCode: `kibo_rating = 5
print(type(kibo_rating))`,
            exercise: {
                question: "Print the data type of the variable `score`:",
                placeholder: `score = 98.5
print(___(score))`,
                solution: "type",
                hints: [
                    "Use the `type()` function to check the data type.",
                    "It's a built-in Python function.",
                    "Just type `type`."
                ]
            }
        },
        {
            id: "numbers",
            title: "Module 6: Python Numbers",
            content: `
# Python Numbers
There are three numeric types in Python:
* \`int\` (Your rank)
* \`float\` (Your percentile)
* \`complex\`

### Int
Int, or integer, is a whole number, positive or negative, without decimals, of unlimited length.

\`\`\`python
daily_streak = 50
kibo_id = 35656222554887711
penalty = -3255522
\`\`\`

### Float
Float, or "floating point number" is a number containing one or more decimals.

\`\`\`python
placement_chance = 99.9
gpa = 8.5
\`\`\`

**Scientific Notation Example:**
\`\`\`python
x = 35e3
y = 12E4
z = -87.7e100
print(type(x))
print(type(y))
print(type(z))
\`\`\`
      `,
            exampleCode: `daily_streak = 50
gpa = 8.5
print(type(daily_streak))
print(type(gpa))`,
            exercise: {
                question: "Insert the correct syntax to convert `streak` into a floating point number.",
                placeholder: `streak = 5
streak = ___(streak)`,
                solution: "float",
                hints: [
                    "You need the logical name for 'floating point number'.",
                    "It's the same as the type name `float`.",
                    "Type `float`."
                ]
            }
        },
        {
            id: "casting",
            title: "Module 7: Python Casting",
            content: `
# Specify a Variable Type
Sometimes you need to convert data types (e.g., turning a Kibo ID number into a string for a URL).

Casting in python is done using constructor functions:
* \`int()\` - makes an integer
* \`float()\` - makes a float
* \`str()\` - makes a string

\`\`\`python
rank = int(1)       # rank is 1
score = int(98.8)   # score is 98
platform = str("Kibo") # "Kibo"
\`\`\`

**Float Casting Example:**
\`\`\`python
x = float(1)     # x will be 1.0
y = float(2.8)   # y will be 2.8
z = float("3")   # z will be 3.0
w = float("4.2") # w will be 4.2
\`\`\`
      `,
            exampleCode: `rank = int(1)
score = int(98.8)
platform = str("Kibo")
print(rank)
print(score)
print(platform)`,
            exercise: {
                question: "Cast the following variable to a string:",
                placeholder: `users = 5000
users = ___(users)`,
                solution: "str",
                hints: [
                    "The function to convert to a string is short for 'string'.",
                    "It has 3 letters.",
                    "Type `str`."
                ]
            }
        },
        {
            id: "strings",
            title: "Module 8: Python Strings",
            content: `
# Strings
Strings in Python are surrounded by either single quotation marks, or double quotation marks.
'Kibo' is the same as "Kibo".

### Slicing Strings
You can return a range of characters by using the slice syntax.
Specify the start index and the end index, separated by a colon.

\`\`\`python
motto = "Learn at Kibo"
print(motto[9:13])
# Output: Kibo
\`\`\`

### Length
To get the length of a string, use the \`len()\` function.

\`\`\`python
a = "Kibo Academy"
print(len(a))
\`\`\`
      `,
            exampleCode: `motto = "Learn at Kibo"
print(motto[9:13])
a = "Kibo Academy"
print(len(a))`,
            exercise: {
                question: "Get the characters 'Kibo' from the text 'I love Kibo'.",
                placeholder: `txt = "I love Kibo"
x = txt[___:___]`,
                solution: "7:11"
            }
        },
        {
            id: "booleans",
            title: "Module 9: Python Booleans",
            content: `
# Boolean Values
In programming you often need to know if an expression is True or False.
At Kibo, we use booleans to check if a student has passed a test.

\`\`\`python
print(kibo_score > 50)  # True
print(kibo_score == 100) # False
\`\`\`

### Most Values are True
Almost any value is evaluated to True if it has some sort of content.
Any string is True, except empty strings.
      `,
            exampleCode: `print(10 > 9)
print(10 == 9)
print(10 < 9)`,
            exercise: {
                question: "The statement below would print a Boolean value, which one?",
                placeholder: `print(99 > 50)
# Output: ___`,
                solution: "True"
            }
        },
        {
            id: "operators",
            title: "Module 10: Python Operators",
            content: `
# Python Operators
Operators are used to perform operations on variables and values.

\`\`\`python
current_xp = 100
bonus_xp = 50
total_xp = current_xp + bonus_xp
print(total_xp)
\`\`\`
      `,
            exampleCode: `print(10 + 5)
print(10 * 5)
print(10 / 2)`,
            exercise: {
                question: "Multiply daily_problems by 7 to get the weekly total.",
                placeholder: `daily_problems = 5
print(daily_problems ___ 7)`,
                solution: "*"
            }
        },
        {
            id: "lists",
            title: "Module 11: Python Lists",
            content: `
# Lists
Lists are used to store multiple items in a single variable.
Think of a List as your "Kibo Backpack" containing all your skills.

List items are ordered, changeable, and allow duplicate values.
List items are indexed, the first item has index [0].

\`\`\`python
kibo_skills = ["Python", "DSA", "System Design"]
print(kibo_skills)
\`\`\`

### Access Items
You access the list items by referring to the index number:

\`\`\`python
kibo_skills = ["Python", "DSA", "System Design"]
print(kibo_skills[1])
# Output: DSA
\`\`\`
      `,
            exampleCode: `kibo_skills = ["Python", "DSA", "System Design"]
print(kibo_skills[1])`,
            exercise: {
                question: "Print the second item in the list:",
                placeholder: `courses = ["Web Dev", "Data Science", "Cyber Security"]
print(___)`,
                solution: "courses[1]"
            }
        },
        {
            id: "tuples",
            title: "Module 12: Python Tuples",
            content: `
# Tuple
A tuple is a collection which is ordered and unchangeable.
Think of a Tuple as a "Certificate" - once issued by Kibo, it cannot be changed.

\`\`\`python
kibo_cert = ("Python Basic", "Issued 2024", "Gold")
print(kibo_cert)
\`\`\`

### Access Tuple Items
You can access tuple items by referring to the index number:

\`\`\`python
print(kibo_cert[0])
\`\`\`
      `,
            exampleCode: `kibo_cert = ("Python Basic", "Issued 2024", "Gold")
print(kibo_cert[0])`,
            exercise: {
                question: "Use the correct syntax to print the first item in the tuple.",
                placeholder: `badges = ("Gold", "Silver", "Bronze")
print(___)`,
                solution: "badges[0]"
            }
        },
        {
            id: "sets",
            title: "Module 13: Python Sets",
            content: `
# Set
A set is a collection which is unordered and unindexed.
Think of a Set as a bag of unique "Kibo Badges" - you can't have the same badge twice.

\`\`\`python
my_badges = {"Solver", "Master", "Legend"}
print(my_badges)
\`\`\`

### Access Items
You check if a badge exists in your set using the \`in\` keyword.
      `,
            exampleCode: `my_badges = {"Solver", "Master", "Legend"}
print("Legend" in my_badges)`,
            exercise: {
                question: "Check if 'Legend' is present in your badges.",
                placeholder: `badges = {"Solver", "Legend"}
if "Legend" ___ badges:
  print("You are a Legend!")`,
                solution: "in"
            }
        },
        {
            id: "dictionaries",
            title: "Module 14: Python Dictionaries",
            content: `
# Dictionary
Dictionaries are used to store data values in key:value pairs.
This is perfect for storing your "Kibo Profile" data.

\`\`\`python
kibo_profile = {
  "username": "CodeMaster",
  "rank": "Diamond",
  "problems_solved": 450
}
print(kibo_profile)
\`\`\`

### Accessing Items
You can access the items of a dictionary by referring to its key name:

\`\`\`python
print(kibo_profile["rank"])
# Output: Diamond
\`\`\`
      `,
            exampleCode: `kibo_profile = {
  "username": "CodeMaster",
  "rank": "Diamond",
  "problems_solved": 450
}
print(kibo_profile["rank"])`,
            exercise: {
                question: "Use the get method to print the value of the 'username' key.",
                placeholder: `user = {
  "username": "Dev123",
  "status": "Active"
}
print(user.___("username"))`,
                solution: "get"
            }
        },
        {
            id: "if-else",
            title: "Module 15: Python If...Else",
            content: `
# Python Conditions
Decisions are key to coding.
Use \`if\` statements to control flow based on logic (e.g., Did the Kibo user pass the test?).

\`\`\`python
score = 95
passing_grade = 70

if score > passing_grade:
  print("Congratulations! You passed the Kibo Exam.")
\`\`\`

### Elif
The \`elif\` keyword is pythons way of saying "if the previous conditions were not true, then try this condition".

\`\`\`python
rank = 2
if rank == 1:
  print("You are #1 on Kibo!")
elif rank == 2:
  print("So close! You are #2.")
\`\`\`

### Else
The \`else\` keyword catches anything which isn't caught by the preceding conditions.

\`\`\`python
score = 40
if score > 70:
  print("Passed")
else:
  print("Keep practicing on Kibo!")
\`\`\`
      `,
            exampleCode: `score = 40
if score > 70:
  print("Passed")
else:
  print("Keep practicing on Kibo!")`,
            exercise: {
                question: "Print 'Hired' if `skills` is greater than 5.",
                placeholder: `skills = 8
___ skills > 5___
  print("Hired")`,
                solution: "if"  // and ":"
            }
        },
        {
            id: "while-loops",
            title: "Module 16: Python While Loops",
            content: `
# The while Loop
With the while loop we can execute a set of statements as long as a condition is true.
Use this to keep practicing until you reach a goal.

\`\`\`python
problems_solved = 0
while problems_solved < 5:
  print("Solved a problem on Kibo!")
  problems_solved += 1
\`\`\`

### The break Statement
With the break statement we can stop the loop even if the while condition is true.

\`\`\`python
xp = 0
while xp < 100:
  print(xp)
  if xp == 50:
    break
  xp += 10
\`\`\`
      `,
            exampleCode: `xp = 0
while xp < 100:
  print(xp)
  if xp == 50:
    break
  xp += 10`,
            exercise: {
                question: "Stop the loop if `xp` is 30.",
                placeholder: `xp = 0
while xp < 100:
  if xp == 30:
    ___
  xp += 10`,
                solution: "break"
            }
        },
        {
            id: "for-loops",
            title: "Module 17: Python For Loops",
            content: `
# Python For Loops
A for loop is used for iterating over a sequence (like a list of Kibo courses).

\`\`\`python
courses = ["Python", "JavaScript", "SQL"]
for x in courses:
  print("I am learning " + x + " on Kibo")
\`\`\`

### The range() Function
To loop through a set of code a specified number of times, we can use the \`range()\` function.

\`\`\`python
for x in range(3):
  print("Kibo is awesome!")
\`\`\`
      `,
            exampleCode: `for x in range(3):
  print("Kibo is awesome!")`,
            exercise: {
                question: "Loop through the items in the `topics` list.",
                placeholder: `topics = ["Variables", "Loops", "Functions"]
___ x in topics:
  print(x)`,
                solution: "for"
            }
        },
        {
            id: "functions",
            title: "Module 18: Python Functions",
            content: `
# Functions
A function is a block of code which only runs when it is called.
Think of functions as "Superpowers" you define once and use many times on Kibo.

### Creating a Function
In Python a function is defined using the def keyword:

\`\`\`python
def welcome_to_kibo():
  print("Welcome, future developer!")
\`\`\`

### Calling a Function
To call a function, use the function name followed by parenthesis:

\`\`\`python
def get_hired():
  print("You got the job!")

get_hired()
\`\`\`
      `,
            exampleCode: `def get_hired():
  print("You got the job!")

get_hired()`,
            exercise: {
                question: "Create a function named `start_coding`.",
                placeholder: `___ start_coding():
  print("Hello Kibo")`,
                solution: "def"
            }
        },
        {
            id: "lambda",
            title: "Module 19: Python Lambda",
            content: `
# Syntax
A lambda function is a small anonymous function.
It's like a "shortcut" function for quick Kibo calculations.

\`\`\`python
# A lambda that adds bonus points to your score
add_bonus = lambda score : score + 10
print(add_bonus(90))
\`\`\`

### Why Use Lambda Functions?
The power of lambda is better shown when you use them as an anonymous function inside another function.

\`\`\`python
def score_multiplier(n):
  return lambda a : a * n

double_xp = score_multiplier(2)
print(double_xp(100)) # Returns 200 XP
\`\`\`
      `,
            exampleCode: `add_bonus = lambda score : score + 10
print(add_bonus(90))`,
            exercise: {
                question: "Create a lambda function that takes one parameter (a) and returns it.",
                placeholder: `x = ___ a : a`,
                solution: "lambda"
            }
        },
        {
            id: "classes",
            title: "Module 20: Python Classes/Objects",
            content: `
# Python Classes/Objects
Python is an Object Oriented Programming language.
A Class is like a "blueprint" for creating objects (e.g., The blueprint for a Kibo Student).

### Create a Class
To create a class, use the keyword class:

\`\`\`python
class KiboStudent:
  platform = "Kibo"
\`\`\`

### Create Object
Now we can use the class named KiboStudent to create objects:

\`\`\`python
user1 = KiboStudent()
print(user1.platform)
\`\`\`
      `,
            exampleCode: `class KiboStudent:
  platform = "Kibo"

user1 = KiboStudent()
print(user1.platform)`,
            exercise: {
                question: "Create a class named `User`:",
                placeholder: `___ User:
  active = True`,
                solution: "class"
            }
        },
        {
            id: "inheritance",
            title: "Module 21: Python Inheritance",
            content: `
# Python Inheritance
Inheritance allows us to define a class that inherits all the methods and properties from another class.
Parent class is the class being inherited from (e.g., \`KiboUser\`).
Child class is the class that inherits (e.g., \`KiboProUser\`).

### Create a Child Class
To create a class that inherits the functionality from another class, send the parent class as a parameter when creating the child class:

\`\`\`python
class KiboPro(KiboStudent):
  pass
\`\`\`
      `,
            exampleCode: `class KiboUser:
  def __init__(self, fname):
    self.firstname = fname
  def printname(self):
    print(self.firstname)

class KiboPro(KiboUser):
  pass

x = KiboPro("Mike")
x.printname()`,
            exercise: {
                question: "Create a class named `Admin` that will inherit from the `User` class.",
                placeholder: `class Admin(___):`,
                solution: "User"
            }
        },
        {
            id: "iterators",
            title: "Module 22: Python Iterators",
            content: `
# Python Iterators
An iterator is an object that contains a countable number of values.
It allows you to traverse through your Kibo achievements one by one.

\`\`\`python
achievements = ("First Login", "First Solve", "Streak 10")
myit = iter(achievements)

print(next(myit))
print(next(myit))
\`\`\`
      `,
            exampleCode: `achievements = ("First Login", "First Solve", "Streak 10")
myit = iter(achievements)

print(next(myit))
print(next(myit))`,
            exercise: {
                question: "Create an iterator from the tuple `goals`, and print the first value:",
                placeholder: `goals = ("Learn", "Build", "Earn")
myit = ___(goals)
print(___(myit))`,
                solution: "iter, next"
            }
        },
        {
            id: "scope",
            title: "Module 23: Python Scope",
            content: `
# Python Scope
A variable is only available from inside the region it is created. This is called scope.

### Local Scope
A variable created inside a function belongs to the local scope of that function.

\`\`\`python
def take_quiz():
  score = 10  # Local to this quiz
  print(score)

take_quiz()
\`\`\`

### Global Scope
A variable created in the main body of the Python code is a global variable.
Use global variables for things that apply everywhere, like "Kibo Platform Name".

\`\`\`python
platform_name = "Kibo"

def show_platform():
  print("I study at " + platform_name)

show_platform()
\`\`\`
      `,
            exampleCode: `platform_name = "Kibo"

def show_platform():
  print("I study at " + platform_name)

show_platform()`,
            exercise: {
                question: "The variable x is created outside the function. Is it a global or a local variable?",
                placeholder: `x = 300
def myfunc():
  print(x)
# Answer: ___`,
                solution: "global"
            }
        },
        {
            id: "modules",
            title: "Module 24: Python Modules",
            content: `
# What is a Module?
Consider a module to be the same as a code library.
A file containing a set of functions you want to include in your application.

### Use a Module
Now we can use the module we just created, by using the import statement:

\`\`\`python
import kibo_library

kibo_library.cheer_student("Jonathan")
\`\`\`

### Built-in Modules
There are several built-in modules in Python, which you can import whenever you like.

\`\`\`python
import platform
x = platform.system()
print(x)
\`\`\`
      `,
            exampleCode: `import platform
x = platform.system()
print(x)`,
            exercise: {
                question: "Import the correct module to display the random number.",
                placeholder: `___ random
print(random.randrange(1, 10))`,
                solution: "import"
            }
        },
        {
            id: "dates",
            title: "Module 25: Python Dates",
            content: `
# Python Dates
A date in Python is not a data type of its own, but we can import a module named datetime to work with dates.
Use this to track your Kibo Streak dates.

\`\`\`python
import datetime

registration_date = datetime.datetime.now()
print(registration_date)
\`\`\`
      `,
            exampleCode: `import datetime

registration_date = datetime.datetime.now()
print(registration_date)`,
            exercise: {
                question: "Import the datetime module and display the current date:",
                placeholder: `___ datetime
x = datetime.datetime.___()
print(x)`,
                solution: "import, now"
            }
        },
        {
            id: "math",
            title: "Module 26: Python Math",
            content: `
# Python Math
Python has a set of built-in math functions that allows you to perform mathematical tasks on numbers.

### Built-in Math Functions
The \`min()\` and \`max()\` functions can be used to find the lowest or highest score in a leaderboard.

\`\`\`python
scores = [55, 89, 99, 100]
lowest = min(scores)
highest = max(scores)
print(highest)
\`\`\`

### The Math Module
Python has also a built-in module called math.

\`\`\`python
import math
x = math.sqrt(64)
print(x)
\`\`\`
      `,
            exampleCode: `import math
x = math.sqrt(64)
print(x)`,
            exercise: {
                question: "Use the correct method to find the square root of 64.",
                placeholder: `import math
x = math.___(64)`,
                solution: "sqrt"
            }
        },
        {
            id: "json",
            title: "Module 27: Python JSON",
            content: `
# Python JSON
JSON is a syntax for storing and exchanging data.
Most API data you fetch for your Kibo projects will be in JSON format.

Python has a built-in package called json, which can be used to work with JSON data.

### Parse JSON - Convert from JSON to Python
If you have a JSON string, you can parse it by using the \`json.loads()\` method.

\`\`\`python
import json

# Data received from Kibo API
json_data =  '{ "user":"John", "kibo_rank":"Gold", "city":"New York"}'

# parse x:
y = json.loads(json_data)

# the result is a Python dictionary:
print(y["kibo_rank"])
\`\`\`
      `,
            exampleCode: `import json
json_data =  '{ "user":"John", "kibo_rank":"Gold", "city":"New York"}'
y = json.loads(json_data)
print(y["kibo_rank"])`,
            exercise: {
                question: "Import the json module.",
                placeholder: `___ json`,
                solution: "import"
            }
        },
        {
            id: "regex",
            title: "Module 28: Python RegEx",
            content: `
# Python RegEx
A RegEx, or Regular Expression, is a sequence of characters that forms a search pattern.
Use RegEx to validate email addresses on your Kibo login forms.

Python has a built-in package called re.

\`\`\`python
import re

txt = "The student is learning at Kibo"
x = re.search("^The.*Kibo$", txt)

if x:
  print("YES! Valid Kibo sentence!")
else:
  print("No match")
\`\`\`
      `,
            exampleCode: `import re
txt = "The student is learning at Kibo"
x = re.search("^The.*Kibo$", txt)
if x:
  print("YES! Valid Kibo sentence!")`,
            exercise: {
                question: "Import the re module.",
                placeholder: `___ re`,
                solution: "import"
            }
        },
        {
            id: "pip",
            title: "Module 29: Python PIP",
            content: `
# What is PIP?
PIP is a package manager for Python packages.
You will use PIP to install cool libraries for your Kibo projects (like Pandas or NumPy).

### What is a Package?
A package contains all the files you need for a module.

### Install PIP
To install a package, use the pip install command in your console:

\`\`\`python
# Installing a game library
C:\\Users\\KiboCoder\\Scripts>pip install pygame
\`\`\`
      `,
            exampleCode: `# PIP commands are run in the terminal, not python script
print("pip install pygame")`,
            exercise: {
                question: "What is the correct command to install a package named 'camelcase'?",
                placeholder: `pip ___ camelcase`,
                solution: "install"
            }
        },
        {
            id: "try-except",
            title: "Module 30: Python Try...Except",
            content: `
# Exception Handling
When an error occurs, Python will normally stop.
As a Kibo Pro, you handle errors gracefully using the try statement.

The \`try\` block lets you test a block of code for errors.
The \`except\` block lets you handle the error.

\`\`\`python
try:
  print(kibo_secret_score)
except:
  print("An exception occurred: Secret score not found")
\`\`\`
      `,
            exampleCode: `try:
  print(kibo_secret_score)
except:
  print("An exception occurred: Secret score not found")`,
            exercise: {
                question: "Insert the missing part to handle the error in the code below.",
                placeholder: `try:
  print(x)
___:
  print("An exception occurred")`,
                solution: "except"
            }
        },
        {
            id: "user-input",
            title: "Module 31: Python User Input",
            content: `
# User Input
Python allows for user input.
Use this to make your Kibo apps interactive.

\`\`\`python
username = input("Enter your Kibo Username:")
print("Welcome back, " + username)
\`\`\`
      `,
            exampleCode: `# input() acts differently in some online IDEs
# In browser-based Python, it often prompts a dialog
username = "KiboStudent" # Simulation
print("Welcome back, " + username)`,
            exercise: {
                question: "Use the input function to ask for the user's name and store it in a variable called 'name'.",
                placeholder: `name = ___("What is your name?")`,
                solution: "input"
            }
        },
        {
            id: "string-formatting",
            title: "Module 32: Python String Formatting",
            content: `
# String Formatting
To make sure a string will display as expected, we can format the result with the format() method.
This is great for creating dynamic "Kibo Certificates".

### The format() Method
To control such values, add placeholders (curly brackets {}) in the text.

\`\`\`python
score = 99
txt = "Your final Kibo score is {} points"
print(txt.format(score))
\`\`\`
      `,
            exampleCode: `score = 99
txt = "Your final Kibo score is {} points"
print(txt.format(score))`,
            exercise: {
                question: "Add a placeholder for the price variable.",
                placeholder: `price = 49
txt = "The price is ___ dollars"
print(txt.format(price))`,
                solution: "{}"
            }
        },
        {
            id: "file-handling",
            title: "Module 33: Python File Handling",
            content: `
# File Handling
The key function for working with files in Python is the \`open()\` function.
You might use this to save your Kibo project logs.

\`\`\`python
f = open("kibo_logs.txt", "r")
print(f.read())
\`\`\`
      `,
            exampleCode: `# File operations require a virtual filesystem in browser
# We can simulate writing to a file
print("Opening file...")
print("Reading content: Kibo Logs v1.0")`,
            exercise: {
                question: "Open the file 'demofile.txt' for reading.",
                placeholder: `f = open("demofile.txt", "___")`,
                solution: "r"
            }
        }
    ]
};
