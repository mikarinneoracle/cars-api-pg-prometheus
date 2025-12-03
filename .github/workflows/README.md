# Container Instances Cars API with Swagger, NGINX and OCI Logging

<img src="../../main.png" width="200"/>
<p>
Image by <a href="http://www.freepik.com">Freepik</a>

## Build containers

Build containers with GitHub Actions <a href="./containers.yml">pipeline</a>.
<p>
    
This requires three secrets:
<pre>
DOCKER_USERNAME
AUTH_TOKEN
TENANCY_NAMESPACE
</pre>
It uses <code>FRA</code> region for OCIR, i.e. Registry is <code>fra.ocir.io</code>
