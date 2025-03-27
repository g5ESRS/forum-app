## Running the project

Due to placement of .env.dev file and structure of the project, the docker-compose command must be run from the root directory of the project by following command:

```bash
docker-compose --env-file backend/.env.dev up --build
```
