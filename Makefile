setup-volumes:
	docker volume create reikai-kouza__node_modules
	docker volume create reikai-kouza--slack-api-test-server__node_modules

up:
	docker-compose up --build -d

down:
	docker-compose down --rmi all

attach-reikai-kouza:
	docker exec -it reikai-kouza /bin/bash

attach-slack-api-test-server:
	docker exec -it reikai-kouza--slack-api-test-server /bin/bash
