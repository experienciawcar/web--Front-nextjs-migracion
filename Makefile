PROJECT  ?= web-wcar-co
REGION   ?= us-east1
SERVICE  ?= web-wcar
REPO     ?= web-wcar
# TAG se fija una sola vez (:=); con ?= la fecha se reevaluaba entre build y release.
ifndef TAG
TAG := $(shell date +%Y%m%d-%H%M%S)-$(shell git rev-parse --short HEAD 2>/dev/null || echo local)
endif
IMAGE     = $(REGION)-docker.pkg.dev/$(PROJECT)/$(REPO)/$(SERVICE):$(TAG)

.PHONY: deploy build release url logs

## deploy: construye la imagen en Cloud Build y la despliega en Cloud Run
deploy: build release url

## build: construye y sube la imagen (Cloud Build, no necesita Docker local)
build:
	gcloud builds submit --project $(PROJECT) --config cloudbuild.yaml \
		--substitutions _TAG=$(TAG),_REGION=$(REGION),_REPO=$(REPO),_SERVICE=$(SERVICE) .

## release: despliega en Cloud Run la imagen de TAG (make release TAG=<tag> sirve de rollback)
release:
	gcloud run deploy $(SERVICE) --project $(PROJECT) --region $(REGION) --image $(IMAGE) \
		--platform managed --allow-unauthenticated --port 8080 \
		--cpu 1 --memory 1Gi --min-instances 1 --max-instances 10

## url: muestra la URL del servicio
url:
	@gcloud run services describe $(SERVICE) --project $(PROJECT) --region $(REGION) --format='value(status.url)'

## logs: últimos logs del servicio
logs:
	gcloud run services logs read $(SERVICE) --project $(PROJECT) --region $(REGION) --limit 100
