# Complementing RESTful with JSON:API or GraphQL
_**Specifications Beyond the Six Architectural Constraints of RESTful**_

This article intends to explain why Hydrogen supports specific RESTful-styled specifications; [JSON:API](https://jsonapi.org/format/) and [GraphQL](https://graphql.org/learn/).

## Prerequisite Understanding and Terms
As outlined by [Roy Fielding](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) (citation), the **Six Architectural Constraints for RESTful API** are as follows:
1. Client-Server
2. Stateless
3. Cache
4. Uniform Interface
5. Layered System
6. Code-On-Demand


## Limitations of the Constraints
A supplemental specification is neccisary beyond the _six architectural constraints_ (**SAC**) of RESTful API because they do not constrain the resource response fields. Thereby leaving the implementors frustrating their consuming application engineers and/or frustrating users of the application due to performance issues.

There are clear benefits of the **SAC**. According to Roy Fielding
> "REST provides a set of architectural constraints that, when applied as a whole, emphasizes scalability of component interactions, the generality of interfaces, independent deployment of components, and intermediary components to reduce interaction latency, enforce security, and encapsulate legacy systems"

However, there is no _constraint_  on how limit or include additional fields for `resource` response. For example, techniques "Sparse Fields" and "Compound Documents" and "Pagination" are not defined in the **SAC**. This leaves it up to the implementors to decide how, or even if, to implement these features.

This is where [JSON:API](https://jsonapi.org/format/) and [GraphQL](https://graphql.org/learn/) (among a few others) provide the needed additional constraints that address the previously listed "techniques" that RESTful API does not address. There are many features that JSON API and GraphQl are capable of, but we are only focusing on the ones that acheive the goal of reducing the size and number of API requests that go between the client and server.

## Adding Constraints through Specifications

### JSON:API
**JSON:API** has features such as **Sparse Fields**, **Compound Documents**, **pagination**, and **caching**.

#### Sparse Fieldset
This is the bread and butter that allows the request to specify the fields needed 
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

### GraphQL
**GraphQL** can also reduce the fields returned by specifying the them in the GraphQL Query. Keep in mind, as its name implies GraphQL is predominantly a Query Language

#### Sparse Fieldsets
```
GET /graphql
books(title: Hobbit) {
  author
  themes
}

response
"books": {
  author: J.R.R. Tolkien
  themes: fantasy, fiction
}
```

#### Caching
GraphQl utilizes HTTP Caching and identifies when objects with globally uniquie identifiers are called again.
https://graphql.org/learn/caching/#gatsby-focus-wrapper

#### Pagination
GraphQL suggests various way to paginate information by requesting a set such as `first:10 offset:20` which is the equivalent of saying "second page of 10 items". Or `first:5 offset:$itemId` which means first 5 items after the ID of this item.
https://graphql.org/learn/pagination/


## Architecture
RESTful API uses HTTP verbs (Post, Get, Patch, etc...) in order to manipulate data. 
Because of this, designing a RESTful system requires creating controllers that enact actions such as: /user [POST], /user/address [GET], /user/age [PATCH] etc... 

In the case of GraphQL, HTTP Get is used to send Queries to a database. For making modifications, HTTP Post requests seem most appropriate since it is not recommended to use HTTP Get for Mutations. See documentation on Mutations at this [link](https://graphql.org/learn/queries/#mutations). 
When a client queries a GraphQL system, using HTTP Get with a /user structure, the server queries the database and replies with only a structure that is predefined. An advantage with this is that there is more control with the requests of GraphQL queries. 

![Alt text](images/graphql-vs-restful.png?raw=true)

---

## References
- Fielding, Roy Thomas (2000). "Chapter 5: Representational State Transfer (REST)". Architectural Styles and the Design of Network-based Software Architectures (Ph.D.). University of California, Irvine. 

- https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm

