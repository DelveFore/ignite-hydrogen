
## Helping out RESTful with JSON API or GraphQL

### Design
The design of RESTful API is to return resources using a Univerisal Resource Identifier. A client could make a requests such as `GET https//example.com/book/Hobbit`. This works in the simplest way to return all data from that resource even if all the fields aren't needed. If you needed specific information like `author` and `title`, you'd need to send multiple request: `GET /Hobbit/author`, `GET /Hobbit/title` This causes a lot of bandwidth between the client and server.

This is where JSON API and GraphQL both solve the problem of reducing the fields that return in an API data query. The goal here is to reduce the size and number of the API requests going between the client and server.

### JSON API
**JSON API** has features such as **Sparse Fields**, **Compound Documents**, **pagination**, and **caching**.
https://jsonapi.org/

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
JSON API takes advantage of the caching ability that HTTP has built in. This reduces the need to return data that has not changed, saving bandwidth.

#### Pagination
JSON API handles Pagination with a standard that `links` such as: `first`, `last`, `next`, and `previous` will return subnets of sort information.
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
Because of this, designing a RESTful system requires creating controllers that enact actions such as: /user [POST], /user/address [GET], /user/age [xPATCH] etc... 

In the case of GraphQL, HTTP Get is used to send Queries to a database. For making modifications, HTTP Post requests seem most appropriate since it is not recommended to use HTTP Get for Mutations. See documentation on Mutations at this [link](https://graphql.org/learn/queries/#mutations). 
When a client queries a GraphQL system, using HTTP Get with a /user structure, the server queries the database and replies with only a structure that is predefined. An advantage with this is that there is more control with the requests of GraphQL queries. 

![Alt text](images/graphql-vs-restful.png?raw=true)
