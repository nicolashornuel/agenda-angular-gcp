FROM nginx:alpine
COPY ./dist/agenda/ /usr/share/nginx/html
EXPOSE 80
#FROM --platform=linux/amd64 image:tag
#linux/amd64, linux/arm64, or darwin/amd64
#docker build . --tag europe-west9-docker.pkg.dev/cloudrun-java/cloud-run-source-deploy/report-frontend:21 --platform=linux/amd64
#docker push europe-west9-docker.pkg.dev/cloudrun-java/cloud-run-source-deploy/report-frontend:21
