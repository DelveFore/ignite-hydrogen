# Complementing RESTful with JSON:API or GraphQL
_**Specifications Beyond the Six Architectural Constraints of RESTful**_

This article intends to explain why Hydrogen supports specific RESTful-styled specifications; [JSON:API](https://jsonapi.org/format/) and [GraphQL](https://graphql.org/learn/).

## Prerequisite Understanding and Terms
As outlined by [Roy Fielding](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) (Fielding, Roy Thomas), the **Six Architectural Constraints for RESTful API** are as follows:
1. Client-Server
2. Stateless
3. Cache
4. Uniform Interface
5. Layered System
6. Code-On-Demand

These terms are worth keeping in mind when understanding a difference in JSON:API and GraphQL that I will bring up later.
- Remote Procedure Call 
> "RPC is the earliest, simplest form of API interaction. 
It is about executing a block of code on another server, 
and when implemented in HTTP or AMQP it can become a Web API." (Phil Sturgeon)

- Representational State Transfer 
> "REST is all about a client-server relationship, where server-side data are made available through
representations of data in simple formats. This format is usually JSON or XML but could be anything."
(Phil Sturgeon)

## Limitations of the Constraints
A supplemental specification is necessary beyond the _six architectural constraints_ (**SAC**) of RESTful API because they do not constrain the resource response fields. Thereby leaving the implementers frustrating their consuming application engineers and/or frustrating users of the application due to performance issues.

There are clear benefits of the **SAC**. According to Roy Fielding
> "REST provides a set of architectural constraints that, when applied as a whole, emphasizes scalability of component interactions, the generality of interfaces, independent deployment of components, and intermediary components to reduce interaction latency, enforce security, and encapsulate legacy systems"

However, there is no _constraint_  on how to limit or include additional fields for `resource` response. 
For example, techniques "Sparse Fields", "Compound Documents" and "Pagination" are not defined in the **SAC**. 
This leaves it up to the implementers to decide how, or even if, to implement these features.

This is where [JSON:API](https://jsonapi.org/format/) and [GraphQL](https://graphql.org/learn/) (among a few others) 
provide the needed additional constraints that address the previously listed "techniques" that RESTful API does not address. 
There are many features that JSON API and GraphQl are capable of, but we are only focusing on the ones that achieve the goal of reducing the size and number of API requests that go between the client and server.

## Adding Constraints through Specifications

### JSON:API
**JSON:API** has features such as **Sparse Fields**, **Compound Documents**, **Pagination**, and **Caching**.

#### Sparse Fieldset
This is the bread and butter that allows the request to specify the fields needed.
There are more examples on Sparse Fieldsets at [jsonapi.org](https://jsonapi.org/examples/#sparse-fieldsets)
```
GET /books?fields[books]=author,themes 
```

#### Compound Documents
This feature allows for including related resources with the initial request
```
GET /books?fields[books]=author,themes,&include=chapter1/title 
```

#### Caching
JSON:API takes advantage of the caching ability that HTTP has built in. This reduces the need to return data that has not changed, saving bandwidth.

#### Pagination
JSON:API handles Pagination with a standard that `links` such as: `first`, `last`, `next`, and `previous` will return subnets of sort information.
https://jsonapi.org/format/#fetching-pagination

---

### GraphQL
As described by Phil Sturgeon, GraphQL compares closer to a RPC API then to a RESTful API like JSON:API

> Listing GraphQL as a direct comparison to these other two concepts is a little odd, as GraphQL is essentially RPC, 
> with a lot of good ideas from the REST/HTTP community tacked in. Still, it is one of the fastest growing API ecosystems out there, 
> mostly due to some of the confusion outlined above.
>
> GraphQL is basically RPC with a default procedure providing a query language, a little like SQL — if that is something you are familiar with. 
> You ask for specific resources and specific fields, and it will return that data in the response.
> (Phil Sturgeon)

**GraphQL** has features such as **Sparse Fields**, **Compound Documents**, **Pagination**, and **Caching**.


#### Sparse Fieldsets
GraphQL utilizes both HTTP POST and GET verbs for querying data. With HTTP POST verb and queries in the `body` more specific information can be
retrieved than with HTTP GET requests. For more information on using POST and GET verbs see their documentation: [HTTP Methods, Headers, and Body](https://graphql.github.io/learn/serving-over-http/#http-methods-headers-and-body)

#### Caching
GraphQL utilizes HTTP Caching and identifies when objects with globally uniquie identifiers are called again.
https://graphql.org/learn/caching/#gatsby-focus-wrapper

#### Pagination
GraphQL suggests various way to paginate returning data by requesting a set such as `first:10 offset:20` which is the equivalent to saying "second page of 10 items". 
Another example is `first:5 offset:$itemId`, equivalent of saying "first 5 items after the ID of this item".
https://graphql.org/learn/pagination/

---

### Final Thoughts
As I've described in this article, GraphQL and JSON:API overlap in providing additional contraints that RESTful does not have. That said, whoever is starting off may find GraphQL to have a steep learning curve, but for anyone already familiar with JSON:API, should be able to pick it up quicker.

---

## References
- Fielding, Roy Thomas. Architectural Styles and the Design of Network-based Software Architectures. Doctoral dissertation, University of California, Irvine, 2000 (https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

- Sturgeon, Phil. Understanding RPC, REST and GraphQL, 2018 (https://apisyouwonthate.com/blog/understanding-rpc-rest-and-graphql)

