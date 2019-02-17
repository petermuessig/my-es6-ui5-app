# my-es6-ui5-app

This project show-cases how to integrate transpiling support for UI5 applications by embedding babel in a custom task via the simple build extensibility concept of the UI5 tooling.

To start the development environment run: 

```bash
npm start
```

The project will be build and the transpiling will take place. Finally a browser will start and open the [```index.html```](webapp/index.html) page.

## Custom Tasks

Custom tasks are simple build modules which can be used to enhance the standard UI5 tooling with additional commands. The custom task has been added in the [```ui5.yaml```](ui5.yaml).

The following snippet shows what needs to be added to the [```ui5.yaml```](ui5.yaml) to add the [```lib/transpileES6Code.js```](lib/transpileES6Code.js) as a task to the project. In addition, in the builder configuration the ```transpileES6Code``` task has been added after the task ```replaceVersion```.

```yaml
---
specVersion: '1.0'
metadata:
  name: my-es6-ui5-app
type: application
builder:
    customTasks:
    - name: transpileES6Code
      afterTask: replaceVersion
---
specVersion: "1.0"
kind: extension
type: task
metadata:
    name: transpileES6Code
task:
    path: lib/transpileES6Code.js
```

The task has been implemented in the file: [```lib/transpileES6Code.js```](lib/transpileES6Code.js) in the same project.

Details can be found in the [Build Extensibility](https://github.com/SAP/ui5-project/blob/master/docs/BuildExtensibility.md) documentation of the [UI5 Tooling](https://github.com/SAP/ui5-tooling).