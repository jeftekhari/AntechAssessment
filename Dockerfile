FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG SERVICE_NAME=AccessRequest.Api

WORKDIR /build
COPY . .
RUN dotnet restore /build/src/services/$SERVICE_NAME/$SERVICE_NAME.csproj

WORKDIR /build/src/services/$SERVICE_NAME
RUN dotnet publish $SERVICE_NAME.csproj -c Release -o /app/build

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
ARG SERVICE_NAME=AccessRequest.Api
ENV SERVICE_NAME=$SERVICE_NAME
WORKDIR /app
COPY --from=build /app/build .

ENTRYPOINT dotnet ${SERVICE_NAME}.dll