/**
 * taruggiz markdown auto extractor : a documentaiton driven development (d3) tool
 * 
 * the dev script uses "mdextract" to create md dile from code 
 * comments and places them in file at locations you want
 * 
 *  
 * 
 */

var expect = require('chai').expect;
var path = require('path');

var mdAuto,
    modulePath = './../',
    processReport = {
        invalidTasks: {},
        status: {},
        validTasks: {}
    };

var valid = {
    configPath: '/tests/mock/dummyConfig.json',
    tasksPath: '/tests/mock/fakeTasks.json'
};

var invalid = {
    pathString: 'not a path',
    JSON: '/tests/mock/badJSON.json'
};

before("can load required modules ", function () {
    /**
     *  requires the following modules
     *  fs, path, async, mdextract
     */
    var neededLibs = ['fs', 'path', 'async', 'mdextract'];
    neededLibs.forEach(function (modulename) {
        it(modulename + " can be loaded", function () {
            try {
                var foundModule = require(modulename);
            } catch (error) {
                throw ('FAILED to require("' + modulename + '") >> ', JSON.stringify(error));
            }
            expect(foundModule).to.be.ok;
        });
    });

    it("mdAuto can be loaded: using required()", function () {
        /**
         *  usage: var mdAuto = require('mdAuto');
         */
        try {
            mdAuto = new require(modulePath).Instance;
        } catch (error) {
            throw ('FAILED to require("mdAuto") >> ', JSON.stringify(error));
        }
        expect(mdAuto).to.be.ok;
    });

    it("mdAuto can set it's root file path", function () {
        /**
         * getDirRoot: mdAuto.getDirRoot();
         * returns a string to the project root dirctory
         */
        expect(mdAuto.getDirRoot).to.be.a('function');

        var customPath = 'test path';
        mdAuto.getDirRoot(customPath)
        expect(mdAuto.rootPath).to.be.a('string').and.equal(customPath);

        expect(mdAuto.getDirRoot()).to.be.an('object');
        expect(mdAuto.rootPath).to.be.a('string')

    });
});

describe("test: mdAuto", function () {
    /* In case you want your whole test suite to fail if one test case fails:
    this.bail(true);
    */
    /* In case you want to slow down the execution:
    beforeEach(function(done){
    	setTimeout(done, 250);  // Delay between each test case in millisecond
    });
    */
    before(function () {
        mdAuto.getDirRoot();
    });


    describe("can load JSON a file", function () {
        /***
         * loadJSONFile:  mdAuto.loadJSONFile(configFile, filePath);
         * returns an object
         * 
         * sets the config and extration JSON files
         * 
         * Arguments
         * configFile : [needed - String] either 'toolConfig' or 'extraction'
         * filePath : [optional - String] path to file 
         * 
         * returns the *JSON* object from the file.
         */
        before(function () {
            it("loadJSONFile is a function", function () {
                expect(mdAuto.loadJSONFile).to.be.a('function');
            });
        });

        it("then returns false when selection is invalid or path is NULL or not a string", function () {
            expect(mdAuto.loadJSONFile('non existant option', null)).to.be.false;
            expect(mdAuto.loadJSONFile('non existant option', valid.configPath)).to.be.false;
            expect(mdAuto.loadJSONFile('config', null)).to.be.false;
        });

        it("then throws an error when given an invalid file path", function () {
            try {
                mdAuto.loadJSONFile('config', invalid.pathString);
                mdAuto.loadJSONFile('tasks', invalid.pathString);
                throw ('Error not thrown when given an invalid file path');
            } catch (error) {
                expect(error).to.be.ok.and.be.a("error");

            }
        });

        it("then throws an error when given invalid json string", function () {
            try {
                mdAuto.loadJSONFile('config', invalid.JSON);
                mdAuto.loadJSONFile('tasks', invalid.JSON);
                throw ('Error not thrown when given an invalid json string');
            } catch (error) {
                expect(error).to.be.ok.and.be.a("error");

            }
        });

        it("will set as a script config object", function () {
            mdAuto.loadJSONFile('config', valid.configPath);

            expect(mdAuto.config).to.be.ok;
            expect(mdAuto.config).to.be.a("object");
        });

        it("will set as an extaction tasks object", function () {
            mdAuto.loadJSONFile('tasks', valid.tasksPath);

            expect(mdAuto.taskList).to.be.ok;
            expect(mdAuto.taskList).to.be.a("object");
        });
    });

    describe("can validate extaction configuration", function () {
        /***
         * prepare: mdAuto.prepare(entry, params, report);
         * returns <Error Object or String>.
         * 
         * checks that the extraction parameters are valid 
         * then add valid ones to the jobs list. 
         * updates the script state report with either a thrown error or state.not started
         * 
         * Arguments
         * entry: [needed - String] the name of extraction entry
         * params : [needed - Object] 
         *  Neededs members
         *      path : <String> can a folder path or file path]
         *      output: <String> fileName of markd down file does not need '.md' extention
         *
         *  Optional
         *      files: <Array of Strings> names of files to extract.  
         *      exlude: <Array of Strings> names of files to ignore. 
         *  ~ "file" nad "exclude" IGNORED if "path" is a file          
         * 
         *      ouputDir: <String> location to place md file.
         *          ~ Default: same folder as source script files 
         * 
         * report : [needed - Object] an object to put the result of preapring 
         *      each extraction entry
         * returns either a thrown error object or the
         * 
         */

        var mockTasks = {};

        before("load mock tasks", function () {
            mockTasks = mdAuto.loadJSONFile('tasks', valid.tasksPath);
        });


        it("mdAuto.prepare is a function", function () {
            expect(mdAuto.prepare).to.be.a('function');
        });

        it("then throws an error on empty objects or non objects", function () {

            try {

                mdAuto.prepare("not and object", "not and object", processReport);
                mdAuto.prepare("empty and object", {}, processReport);
                throw ('FAILED to throw error when given empty objects or non objects', JSON.stringify(error));

            } catch (error) {
                expect(error).to.be.ok.and.be.a("string");
            }

        });

        it("then throws an error when given a non String key for a task entry", function () {
            try {
                mdAuto.prepare(1, mockTasks.singleFile1, processReport);
                throw ('FAILED to throw error when given a non string key in the task list', JSON.stringify(error));

            } catch (error) {
                expect(error).to.be.ok.and.be.a("string");
            }

        });

        it("then throws an error when given a non Object 'report' argument", function () {
            var badTask = {
                path: '',
                not_file: 'so "file" member does not exist',
                output: null
            };
            try {

                mdAuto.prepare("singleFile1", mockTasks.singleFile1, "not and object");
                throw ('FAILED to throw error when given a non Object "report" argument', JSON.stringify(error));

            } catch (error) {
                expect(error).to.be.ok.and.be.a("string");
            }
        });

        it("then throws an error when given falsy 'path' or 'file' members", function () {
            var badTask = {
                path: '',
                not_file: 'so "file" member does not exist',
                output: null
            };
            try {

                mdAuto.prepare("badEntry", badTask, processReport);
                throw ("FAILED to throw error when falsy 'path' or 'file' members", JSON.stringify(error));

            } catch (error) {
                expect(error).to.be.ok.and.be.a("string");
            }
        });

        it("then throws an error when given a falsy or non String or 'output' member", function () {
            var badTask = {
                path: 'mock/',
                output: null
            };
            try {

                mdAuto.prepare("badEntry", badTask, processReport);
                throw ("FAILED to throw error when given a falsy or non String or 'output' member", JSON.stringify(error));

            } catch (error) {
                expect(error).to.be.ok.and.be.a("string");
            }
        });

        it("then throws an error when given a falsy 'path' member", function () {
            var badTask = {
                path: null,
                output: "singleFile"
            };
            try {

                mdAuto.prepare("badEntry", badTask, processReport);
                throw ("FAILED to throw error when given a falsy 'path' member", JSON.stringify(error));

            } catch (error) {
                expect(error).to.be.ok.and.be.a("string");
            }
        });

        it("then throws an error when given a non Array 'files' member", function () {

            var badTask = {
                path: "mock/",
                files: 'not an Array',
                output: "singleFile"
            };
            try {

                mdAuto.prepare("badEntry", badTask, processReport);
                throw ("FAILED to throw error when given a falsy 'path' member", JSON.stringify(error));

            } catch (error) {
                expect(error).to.be.ok.and.be.a("string");
            }
        });
    });

    describe("can check file path", function () {
        /***
         * checkPaths: mdAuto.checkPaths(entry, taskObj);
         * returns  <Object>.
         * 
         * checks if "path" and "outputDir" members of taskObj exist and
         *      are vaild 
         *
         * ~ entry [needed - String] - name/key of the the task object in this.validTasks
         * ~ taskObj [needed - object] - an object in this.validTasks
         * 
         * returns {
         *  ~ type:  null [default] - "file"if taskObj.path is file or "folder" 
         *         if its a folder.
         *  
         *  ~ output: false [default] - "true" if taskObj.outputDir is valid
         *
         *  }
         */

        before(function () {
            mdAuto = new require(modulePath).Instance;
        });


        it("then throws an error if 'path' is does not exist", function () {
            var badTask = {
                path: 'does not exist',
                output: 'will not be made',
            };

            try {
                var result = mdAuto.checkPaths(badTask);
            } catch (error) {
                expect(error).to.be.a('error');
            }
        });

        it("then throws an error if 'outputDir' is does not exist", function () {
            var badTask = {
                path: 'tests/mock/testScript.js',
                output: 'will not be made',
                outputDir: 'does not exist',
            };

            try {
                var result = mdAuto.checkPaths(badTask);
            } catch (error) {
                expect(error).to.be.a('error');
            }
        });

        it("then returns an error if given the 'files' array BUT 'path' is a file", function () {
            var badTask = {
                path: 'tests/mock/testScript.js',
                output: 'will not be made',
                files: ['should not be used when path is a file']
            };

            var result = mdAuto.checkPaths(badTask);

            expect(result).to.be.ok
                .and.to.be.an("object")
                .and.to.include.keys('error');

            expect(result.error).to.be.a("string");
        });

        it("then returns an error if given a 'folder' BUT NO 'files' array", function () {

            var badTask = {
                path: 'tests/mock/',
                output: 'will not be made'
            };

            var result = mdAuto.checkPaths(badTask);

            expect(result).to.be.ok;
            expect(result.error).to.be.an("string");

        });

        it("then makes 'taskObj.outputDir' the same as 'taskObj.path' if 'outputDir' is not provided", function () {
            var goodTask = {
                path: 'tests/mock/testScript.js',
                output: 'testSamefile',
            };

            var folderPath = path.parse(goodTask.path).dir;
            var result = mdAuto.checkPaths(goodTask);

            expect(result).to.be.ok
                .and.to.be.an("object")
                .and.to.include.keys('output');

            expect(result.type).to.be.ok
                .and.to.be.a("string")
                .and.to.equal("file");

            expect(result.output).to.be.ok
                .and.to.be.a("boolean")
                .and.to.be.true;

            expect(goodTask).to.include.keys('outputDir');
            expect(goodTask.outputDir).to.be.equal(path.join(folderPath));

        });
    });

    describe("can check file names", function () {
        /***
         * checkFileNames: mdAuto.checkFileNames(taskObj);
         * returns  <Object>.
         * 
         * checks if "path" and "outputDir" members of taskObj exist and
         *      are vaild 
         *
         * ~ taskObj [needed - object] - an object in this.validTasks
         * 
         * returns {
         *	
         *  ~ validFiles: [Array] - files that exist AND have a supported file type extention
         *  ~ unsupported: [Array] - files that DO NOT have a supported file type extention 
         *  ~ error: [Array] - any errors when reading files in the taskObj.files array
         *	
         *  }
         */
        var testTask;

        before(function () {
            testTask = {
                path: 'tests/mock',
                outputDir: 'tests/output',
                files: []
            }
            mdAuto = new require(modulePath).Instance;
            mdAuto.getDirRoot();
        });

        it("returns an array of unsupported files when given an unsupported file type", function () {
            testTask.files = ['badJSON.json', 'dummyConfig.JSON', 'testScript.js'];
            var result = mdAuto.checkFileNames(testTask);

            expect(result).to.be.ok
                .and.to.be.an("object")
                .and.to.include.keys('unsupported');

            expect(result.unsupported).to.be.ok
                .and.to.be.an("array")
                .and.to.contain.members(testTask.files.slice(0, 1));
        });

        it("returns an array of errors files when given non existant file names", function () {
            testTask.files = ['nonExistingFile.js', 'testScript.js'];
            var result = mdAuto.checkFileNames(testTask);

            expect(result).to.be.ok
                .and.to.be.an("object")
                .and.to.include.keys('errors');

            expect(result.errors).to.be.ok
                .and.to.be.an("array");

            expect(result.errors[0]).to.be.ok;

        });

        it("returns an array of valid files when given valid file names", function () {
            testTask.files = ['nonExistingFile.js', 'testScript.js'];

            var result = mdAuto.checkFileNames(testTask);

            expect(result).to.be.ok
                .and.to.be.an("object")
                .and.to.include.keys('validFiles');

            expect(result.validFiles).to.be.ok
                .and.to.be.an("array");

            expect(result.validFiles[0]).to.be.ok;

        });
    });

    describe("can extract MarkDown", function () {
        /***
         * extractMarkDown: mdAuto.extractMarkDown(entry, taskObj);
         * returns  void?
         * 
         * perfoms extraction of mark down comments and saves them to file
         *
         * ~ entry [needed - String] - name/key of the the task object in this.validTasks
         * ~ taskObj [needed - object] - an object in this.validTasks
         *
         */
        var testTask;

        before(function () {
            mdAuto = new require(modulePath).Instance
            mdAuto.getDirRoot();
        });

        it("saves a single md file ", function () {

            testTask = {
                path: 'tests/mock',
                output: 'single_file',
                outputDir: 'tests/output',
                files: ['testScript.js']
            }
            debugger;
            mdAuto.extractMarkDown('testTask', testTask);

        });
    });

    describe("can extract MarkDown2", function () {
        /***
         * extractMarkDown: mdAuto.extractMarkDown(entry, taskObj);
         * returns  void?
         * 
         * perfoms extraction of mark down comments and saves them to file
         *
         * ~ entry [needed - String] - name/key of the the task object in this.validTasks
         * ~ taskObj [needed - object] - an object in this.validTasks
         *
         */
        var testTask;

        before(function () {
            testTask = {
                path: 'tests/mock',
                outputDir: 'tests/output',
                files: []
            }
            mdAuto = new require(modulePath).Instance
            mdAuto.loadJSONFile('tasks', valid.tasksPath);
        });

        it("saves a single md file ", function (done) {
            debugger;
            mdAuto.start(done);
        });


    });
});
