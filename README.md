# SOMHunter UI

User interface to control the [SOMHunter](https://github.com/siret-junior/somhunter) tool. 

It's imlemented as a web application therefore it may run on remote machine and end users can use it just as any other web application.

## **Build & Run with Docker (recommended)**
```sh
# Build the container
sudo docker build -t somhunter-data-server .
# Install the app
sudo docker run -ti --rm -v $(dirname $PWD):/somhunter somhunter-ui:latest sh install.sh
# Run it on the port 8080
sudo docker run -ti --rm -v $(dirname $PWD):/somhunter -p 8080:8080 somhunter-ui:latest sh run.sh
```

## **Build & Run**
### Prerequisites
You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)


```sh
sh instal.sh
sh run.sh
```

### For development
```sh
# This launches the app in debug mode with livereload feature
ember serve
```

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
