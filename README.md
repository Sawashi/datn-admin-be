### Tech stack
- Nestjs + typeorm + postgres
### Requirements
- Table plus (to connect Postgres): https://tableplus.com/
- Docker desktop: https://www.docker.com/
- Postman (for testing apis on local and documenting): https://www.postman.com/
### Installation:
- Install all items in the requirements
- Start Docker
- Run:
  ```
  yarn install
  yarn start
  ```
- Start table plus, create a new connection by using the data in "docker-compose.yml" and then you're good to go
### Extra info:
- After running the be code, you can use postman to test the routes of api by using url localhost:3000/... (replace "..." with the actual route such, ex: localhost:3000/users)
- The postgres is available at port 5432 but you must access it by using table plus or some software like that due to we not implement a UI on web at that port
