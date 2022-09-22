# Lesson 13 - APIs
## Architecture overview
* API endpoints
* HTTP and HTTPS requests and responses
* Architectures
  * RESTful, SOAP,  GraphQL, gRPC, Falcor, Pure JSON and others
  * Webhooks
  * MVC
* Documentation
  * Swagger and Postman
* Programming languages and Frameworks
### References
https://tray.io/blog/how-do-apis-work

https://restfulapi.net/

https://leapgraph.com/rest-api-alternatives/

https://futurice.com/blog/api-services-mvc

https://merehead.com/blog/development-trends-best-backend-frameworks-in-2022/
## Architecture design
* Information and data
* Object Modeling and resources
* Model URIs
* Controllers
* Services
* Database
### References
https://restfulapi.net/rest-api-design-tutorial-with-example/

https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis/
## NestJS Framework
* Running services with node
* Web server with node
* Using Express to run a node web server
* About using frameworks
* Using NestJS framework
* Overview of a NestJS project
* Using the CLI
* Initializing a project with NestJS
* Swagger plugin
### References
https://nodejs.org/en/docs/guides/getting-started-guide/

https://devdocs.io/express-getting-started/

https://docs.nestjs.com/

https://github.com/brocoders/nestjs-boilerplate

https://docs.nestjs.com/openapi/introduction
## Implementing the API
* The NestJS CLI
* Creating Resources
* Controllers, Services and Routes in NestJS
* Modules and injections (overview)
* Server configuration
* Serving scripts as services
* Params, DTOs and Payloads
* HTTP errors and messages
* (Review) Environment
* Implementing the features
### References
https://docs.nestjs.com/cli/overview

https://docs.nestjs.com/recipes/crud-generator
# Homework
* Read the references
* Implement GET methods to query total supply,  allowance from a given address to another address, transaction status by transaction hash and transaction receipt of a transaction by transaction hash
* (Optional) Remove the wallet from the environment, and implement a method to setup a wallet passing the private key as parameter
  * Methods that require a wallet should give an error message explaining that a wallet must be set before using that method
