setup-volumes:
	docker volume create reikai-kouza__node_modules

up:
	docker-compose up --build -d

down:
	docker-compose down --rmi all

attach-reikai-kouza:
	docker exec -it reikai-kouza /bin/bash

attach-api:
	docker exec -it reikai-kouza--api /bin/bash

attach-db:
	docker exec -it reikai-kouza--db /bin/bash

attach-slack-api-test-server:
	docker exec -it reikai-kouza--slack-api-test-server /bin/bash
