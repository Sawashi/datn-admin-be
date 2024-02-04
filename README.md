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
- Start table plus, create a new PostgreSQL connection by clicking button "+" and fillout the form by using the data in "docker-compose.yml", click button "test" to check if it work then click "save"
- Access the data in tables by clicking the connection you have added on home of table plus
- You are good to go
### Extra info:
- After running the be code, you can use postman to test the routes of api by using url localhost:3000/... (replace "..." with the actual route such, ex: localhost:3000/users)
- The postgres is available at port 5432 but you must access it by using table plus or some software like that due to we not implement a UI on web at that port

### Commit Convention

## FORMAT: type: subject

# Type:
- build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- ci: Changes to our CI configuration files and scripts (example scopes: Gitlab CI, Circle, BrowserStack, SauceLabs)
- chore: add something without touching production code (Eg: update npm dependencies)
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- revert: Reverts a previous commit
- style: Changes that do not affect the meaning of the code (Eg: adding white-space, formatting, missing semi-colons, etc)
- test: Adding missing tests or correcting existing tests

# Subject: commit content

