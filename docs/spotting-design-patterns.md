# The Strategy Pattern
### Best Application
A description of what a Strategy Pattern is _“A pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable. 
This lets the algorithm vary independently from clients that use it”_ (Freeman and Robson #)

It is my opinion that the best time to apply a Strategy Pattern is when you are facing the problem of repeatedly adding code in order to omit functionality. 

### Code Examples / Code Snippets
see `docs/code-snippets/strategy-design.js` for example

### How to Spot them
The way you spot this pattern is when an **algorithm** is introduced by an **interface** through **composition**.

**Composition** is described as a relationship between a class and superclass where the class is delegated an algorithm from the superclass. (Freeman and Robson #)

# The Adapter Pattern
### Best Application
In this scenario a new interface is introduced in place an of existing interface for whatever reason, 
but this new interface is incompatible  with the client interface. This is where we could use an Adapter Pattern to
_"convert the interface of a class into another interface that clients expect. 
It allows classes to work together that couldn't otherwise because of incompatible interfaces"_ (Freeman and Robson #)

### Code Examples / Code Snippets
see `docs/code-snippets/adapter-design.js` for example

### How to Spot them
You are looking for two classes (most commonly a client class and server class) that are communicating through
incompatible interfaces. This mean they don't work together to achieve what the client expects.
If there are enough similarities between the differing interfaces, an **adapter** can be implemented to translate them.
If you have to drastically change the behaviour of the client interface to fix the adapter, this pattern may not be the right choice.

### References
Freeman, Eric, and Elisabeth Robson. Programming Foundations: Design Patterns. LinkedIn: inLearning, 2019.
