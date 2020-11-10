
## Helping out RESTful with JSON API or GraphQL

### Design
**State why you need JSON API or GraphQL**
RESTful API is designed with the simplest intention to return recouses with a Univerisal Resource Identifier. Requests such as `GET https//example.com/book/Hobbit` work in the simplest way to return all data from that resource even if all the fields aren't needed. 

JSON API and GraphQL both solve the problem of reducing the fields that return in an API data query. The goal here is to reduce the number of API requests and the size of the packages going between the client and server.

### JSON API
**JSON API** has features such as Compound Documents (requesting related resources with the request), Sparse Fields (specify only the fields to return), pagination, and caching.

#### Compound Documents
```
GET /books?include=author 
```
#### Sparse Fieldset
```
GET /books?fields[books]=author,themes 
```
#### Caching
JSON API takes advantage of the caching ability that HTTP has built in. This reduces the need to return data that has not changed, saving bandwidth.

#### Pagination
Pagination is handled by JSON API by sending the requested data in subnets with `first`, `last`, `next`, and `previous` links to sort through the subsets.

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

GraphQL does not utilize HTTP **caching**. This means there is not a suggested solutions, and so implementation can vary.

## Architecture
RESTful API uses HTTP verbs (Post, Get, Patch, etc...) in order to manipulate data. 
Because of this, designing a RESTful system requires creating controllers that enact actions such as: /user [POST], /user/address [GET], /user/age [xPATCH] etc... 

In the case of GraphQL, HTTP Get is used to send Queries to a database. For making modifications, HTTP Post requests seem most appropriate since it is not recommended to use HTTP Get for Mutations. See documentation on Mutations at this [link](https://graphql.org/learn/queries/#mutations). 
When a client queries a GraphQL system, using HTTP Get with a /user structure, the server queries the database and replies with only a structure that is predefined. An advantage with this is that there is more control with the requests of GraphQL queries. 

![Alt text](images/graphql-vs-restful.png?raw=true)
