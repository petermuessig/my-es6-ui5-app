const path = require("path");
const babel = require("@babel/core");
const log = require("@ui5/logger").getLogger("builder:customtask:transpile");
const pathregen = require("regenerator-runtime/path").path;
const resourceFactory = require("@ui5/fs").resourceFactory;
const fs = require('fs');

/**
 * Task to transpiles ES6 code into ES5 code.
 *
 * @param {Object} parameters Parameters
 * @param {DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {Object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise<undefined>} Promise resolving with undefined once data has been written
 */
module.exports = async function ({
    workspace,
    dependencies,
    options
}) {
    let resources = await workspace.byGlob("/**/*.js");
    //get path of Component
    const componentResource = resources.find((jsResource) => jsResource.getPath().includes("Component.js"));
    const toPath = componentResource.getPath();
    const pathPrefix = toPath.replace("Component.js", "");
    //get path of regenerator in node_modules
    const pathRegenerator = pathregen.substr(pathregen.indexOf("node_modules") + 13).replace("\\", "/");
    //build full path for regenerator in current project
    const virtualPathRegenerator = pathPrefix + pathRegenerator;
    //get code of regenereator
    const runtimeCode = fs.readFileSync(pathregen, 'utf8');
    //create resource
    const runtimeResource = resourceFactory.createResource({
        path: virtualPathRegenerator,
        string: runtimeCode
    });
    //save regenerator to workspace
    await workspace.write(runtimeResource);

    //add require regenerator for development prupose
    let componentSource = await componentResource.getString();
    const requirePath = virtualPathRegenerator.replace("/resources/","").replace(".js","");
    componentSource = "// development mode: load the regenerator runtime synchronously\nif(!window.regeneratorRuntime){sap.ui.requireSync(\""+requirePath+"\")}" + componentSource;
    componentResource.setString(componentSource);
    await workspace.write(componentResource);

    resources = await workspace.byGlob("/**/*.js");
    return await Promise.all(resources.map((resource) => {
        return resource.getString().then((value) => {
            log.info("Transpiling file " + resource.getPath());
            return babel.transformAsync(value, {
                sourceMap: false,
                presets: ["@babel/preset-env"],
                plugins: [
                    ["@babel/plugin-transform-modules-commonjs", {
                        "strictMode": false
                    }]
                ]
            });
        }).then((result) => {
            resource.setString(result.code);
            workspace.write(resource);
        });
    }));
};