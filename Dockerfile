# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["OzlasteksanWeb.csproj", "./"]
RUN dotnet restore "OzlasteksanWeb.csproj"

# Copy remaining source code
COPY . .

# Build the application
RUN dotnet build "OzlasteksanWeb.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "OzlasteksanWeb.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Expose port
EXPOSE 8080
EXPOSE 8081

# Copy published application
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Start the application
ENTRYPOINT ["dotnet", "OzlasteksanWeb.dll"]
