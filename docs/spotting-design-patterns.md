# The Strategy Pattern
### Personal Opinion of Best Application
A description of what a Strategy Pattern is _“A pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable. 
This lets the algorithm vary independently from clients that use it”_ (Freeman and Robson #)

It is my opinion that the best time to apply a Strategy Pattern is when you are facing the problem of repeatedly adding code in order to omit functionality. 

### Code Examples / Code Snippets
see `docs/code-snippets/strategy-design.js` for example

### How to Spot them
The way you spot this pattern is when an **algorithm** is introduced by an **interface** through **composition**.

**Composition** is described as a relationship between a class and superclass where the class is delegated an algorithm from the superclass. (Freeman and Robson #)

### References
Freeman, Eric, and Elisabeth Robson. Programming Foundations: Design Patterns. LinkedIn: inLearning, 2019.
