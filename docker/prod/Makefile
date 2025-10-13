#TODO: DOCKERFILE BUILD FUNCTIONS
############################################################################################################
build:
	echo "prod_build çalıştı."
	{ \
		echo "TAG='$(TAG)'"; \
	} > ./.env
	docker-compose stop nuxt
	docker system prune -a -f --all
	docker system prune -a -f --volumes
	# Registry login gerekmiyor, --build ile local build yapıyoruz
	# docker login -u "$(PROD_DEPLOY_USERNAME)" -p "$(PROD_DEPLOY_PASSWORD)" "registry.gitlab.com"
	docker-compose --env-file ./.env up -d --build nuxt


#TODO: FIRST BUILD FUNCTIONS
############################################################################################################
build_first:
	echo "prod_build_first çalıştı."
	make build


#TODO: REBUILD BUILD FUNCTIONS
############################################################################################################
rebuild:
	echo "prod_rebuild çalıştı."
	make build


#TODO: REMOVE FUNCTIONS
############################################################################################################
remove_container:
	echo "prod_remove_container çalıştı."
	docker-compose down --rmi all -v
	docker system prune -a -f --all
	docker system prune -a -f --volumes
