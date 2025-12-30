# NodeJS Cars API with Swagger and PostgreSQL

## Build containers

Build containers with GitHub Actions <a href=".github/workflows/containers.yml">pipeline</a>.
<p>

This requires three secrets:
<pre>
DOCKER_USERNAME
AUTH_TOKEN
TENANCY_NAMESPACE
</pre>
It uses <code>FRA</code> region for OCIR, i.e. Registry is <code>fra.ocir.io</code>

## Config

Logfile and PG connection file paths are hard coded on the lines 14-15 of the <a href="https://github.com/mikarinneoracle/cars-api-pg-prometheus/blob/b683913e1167011a1f076132c6d6d4bebdf3c300/index.js#L14-L15">index.js</a>
<pre>
var configFile = "/secrets/connection.txt";
var logFile = "/var/log/app.log";
</pre>