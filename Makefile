docker-up:
	docker compose up -d

docker-up-build:
	docker compose up -d --build

docker-down:
	docker compose down --remove-orphans

docker-clear:
	docker compose down -v --remove-orphans

docker-run-cli:
	docker compose run --rm php-cli sh

docker-run-migrate:
	docker compose run --rm php-cli php artisan migrate

docker-run-tests:
	docker compose run --rm php-cli composer test-cover

docker-run-tests-cover-xml:
	docker compose run --rm php-cli composer test-cover-xml
