# Snakey
Repositorio con la finalidad de aplicar nuevas tecnologias a un juego de "Snake"

Setup basico:

Inicializar base de datos, ejemplo simple con CockraochDB, 

```shell
cockroach start-single-node --insecure --listen-addr=localhost --http-addr=localhost:8080
```

Despues se debe crear un archivo .env y llenar las variables como se muestra en el archivo .env.example 
para que el API de Go pueda conectarse.

Finalmente correr src/main.go usando el commando ```sh go run src/main.go```
y asi mismo correr el frontend ya sea con el comando de build o de run (usando npm).