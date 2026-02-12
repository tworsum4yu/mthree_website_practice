# mthree_website_practice

## Docker
Just something to keep note of.

Website is served to 8080 and docker container exposed to 8080.

Use below code to run the container:
docker build -t my-website .
docker run -p 8080:8080 my-website