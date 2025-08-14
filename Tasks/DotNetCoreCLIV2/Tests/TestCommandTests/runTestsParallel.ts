import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '../..', 'dotnetcore.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('command', "test");
tmr.setInput('projects', '**/*.test.dll');
tmr.setInput('runParallel', process.env["__runParallel__"] ? process.env["__runParallel__"] : "false");

let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "which": { "dotnet": "c:\\path\\dotnet.exe" },
    "checkPath": { "c:\\path\\dotnet.exe": true },
    "exec": {
        "c:\\path\\dotnet.exe test first.test.dll": {
            "code": 0,
            "stdout": "test succeeded",
            "stderr": ""
        },
        "c:\\path\\dotnet.exe test second.test.dll": {
            "code": 0,
            "stdout": "test succeeded",
            "stderr": ""
        },
        "c:\\path\\dotnet.exe test first.test.dll second.test.dll --parallel": {
            "code": 0,
            "stdout": "test succeeded",
            "stderr": ""
        },
    },
    "findMatch": {
        "**/*.test.dll": ["first.test.dll", "second.test.dll"],
    }
};

tmr.setAnswers(a);
tmr.registerMock('azure-pipelines-task-lib/toolrunner', require('azure-pipelines-task-lib/mock-toolrunner'));

tmr.run();