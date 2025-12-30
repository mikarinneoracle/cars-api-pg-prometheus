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
