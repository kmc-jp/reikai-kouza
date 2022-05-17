FROM node:17-alpine3.14
RUN apk add bash
ENTRYPOINT ["bash"]
WORKDIR /slack-api
COPY . .
CMD [ "/slack-api/docker/slack-api/build_api_server.sh" ]
