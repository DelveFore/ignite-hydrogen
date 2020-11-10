
## GraphQL comparing to RESTful

### Design/Architecture
RESTful API uses HTTP verbs (Post, Get, Patch, etc...) in order to manipulate data. 
Because of this, designing a RESTful system requires creating controllers that enact actions such as: /user [POST], /user/address [GET], /user/age [xPATCH] etc... 

In the case of GraphQL, HTTP Get is used to send Queries to a database. For making modifications, HTTP Post requests seem most appropriate since it is not recommended to use HTTP Get for Mutations. See documentation on Mutations at this [link](https://graphql.org/learn/queries/#mutations). 
When a client queries a GraphQL system, using HTTP Get with a /user structure, the server queries the database and replies with only a structure that is predefined. An advantage with this is that there is more control with the requests of GraphQL queries. 

JSON API and GraphQL both solve the problem of reducing the fields that return in an API data query. The goal here is to reduce the number of API requests and the size of the packages going between the client and server.

**JSON API** has features such as Compound Documents (breifly explain what this does), Sparse Fields (specify only the fields to return), 

```
GET /books?fields[books]=author,themes 
```

**GraphQL** can also reduce the fields returned by specifying the them in the GraphQL Query.
has what features? Does JSON API have those features or similar?

Sparse Fieldsets
```
POST /graphql
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

![Alt text](images/graphql-vs-restful.png?raw=true)

A RESTful system can fetch a lot of data with a single request. With GraphQL, more specific requests can be defined to fetch only the data you need.
The disadvantage with a RESTful single request is that it could lead to overfetching data and thus waiting bandwidth. With GraphQL, you need to define your data retrieval specifically to what you need. This requires a well defined structure. 

