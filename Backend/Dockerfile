# Etapa 1: compila o jar com o Maven Wrapper do projeto
FROM eclipse-temurin:11-jdk-jammy AS build
WORKDIR /app

# Baixa as dependências antes de copiar o código, para o Docker reaproveitar esta camada
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw -B -q dependency:go-offline

COPY src src
RUN ./mvnw -B -q package -DskipTests

# Etapa 2: só o JRE e o jar, rodando sem root
FROM eclipse-temurin:11-jre-jammy
WORKDIR /app
RUN useradd --system --no-create-home app
COPY --from=build /app/target/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
