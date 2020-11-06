
## GraphQL comparing to RESTful

### Design/Architecture
RESTful API uses HTTP verbs (Post, Get, Patch, etc...) in order to manipulate data. 
Because of this, designing a RESTful system requires creating controllers that enact actions such as: /user [POST], /user/address [GET], /user/age [PATCH] etc... 

In the case of GraphQL, HTTP Get is used to send Queries to a database. For making modifications, HTTP Post requests seem most appropriate since it is not recommended to use HTTP Get for Mutations. See documentation on Mutations at this [link](https://graphql.org/learn/queries/#mutations). 
When a client queries a GraphQL system, using HTTP Get with a /user structure, the server queries the database and replies with only a structure that is predefined. An advantage with this is that there is more control with the requests of GraphQL queries. 

![Alt text](images/graphql-vs-restful.png?raw=true)

The conclusion is a RESTful system can fetch a lot of data with a single request. With GraphQL, more specific requests can be defined to fetch only the data you need.
The disadvantage with a RESTful single request is that it could lead to overfetching data and thus waiting bandwidth. With GraphQL, you need to define your data retrieval specifically to what you need. This requires a well defined structure. 

