create_network:
	docker network create local-network

start:
	rm -rf .env && rm -rf node_modules && rm -rf .nuxt
	docker-compose up -d --build --force-recreate nuxt
	sleep 10
	docker cp valdori-crm-frontend:/usr/src/app/.nuxt .
	docker cp valdori-crm-frontend:/usr/src/app/node_modules .
	docker cp valdori-crm-frontend:/usr/src/app/package.json .
	docker cp valdori-crm-frontend:/usr/src/app/package-lock.json .
	docker cp valdori-crm-frontend:/usr/src/app/.env .

stop:
	docker-compose down --rmi all -v
	rm -rf .nuxt
	rm -rf node_modules

reload:
	docker-compose restart nuxt

copy:
	rm -rf .nuxt
	rm -rf node_modules
	docker cp valdori-crm-frontend:/usr/src/app/.nuxt .
	docker cp valdori-crm-frontend:/usr/src/app/node_modules .
	docker cp valdori-crm-frontend:/usr/src/app/package.json .
	docker cp valdori-crm-frontend:/usr/src/app/package-lock.json .
	docker cp valdori-crm-frontend:/usr/src/app/.env .

exec:
	docker exec -it valdori-crm-frontend sh