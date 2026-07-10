FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY apps/api/*.csproj ./apps/api/
RUN dotnet restore ./apps/api/*.csproj

COPY apps/api ./apps/api
WORKDIR /src/apps/api

RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 10000

ENTRYPOINT ["sh", "-c", "dotnet api.dll --urls http://0.0.0.0:${PORT:-10000}"]