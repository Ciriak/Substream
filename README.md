<p align="center">
  <img src="http://i.imgur.com/b3wUBo5.png" />
</p>
<h1 align="center">Substream</h1>
<h3 align="center">A subtitle editor tool</h3> 

### 

### [ > Download the latest release](https://github.com/Cyriaqu3/Substream/releases/latest)

**Any suggestion / Bug ?**
[Please, report them here](https://github.com/Cyriaqu3/tagifier/issues)

## Development

### Prerequisites

- [Node / NPM](https://nodejs.org/)
- [Bower](https://bower.io/)

### Compiling the sources

Clone the repo , open a terminal on the project folder and type :

```
npm install
```

### Working with the sources

Open a terminal on the project folder and type :

```
gulp
```
Stay with the terminal open the src folder will be compiled on fly.

For testing , you have to follow the instructions below.

### Testing the app

Open a terminal on the project folder and type :

```
electron dist/app.js
```

Tagifier should start

### Packaging the App

Open a terminal on the project folder and type :

```
gulp build
```
The packaged software should be available in the folder */build* and the release package (with the setup) in */release*.
