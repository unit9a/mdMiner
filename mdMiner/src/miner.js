const async = require('async'),
    fs = require('fs'),
    path = require('path'),
    mdextract = require('mdextract'),
    extractionSpawn = require('child_process').fork(`extraction.js`),
    log = require('single-line-log').stdout;

function Miner() {
    this.rootPath = '';
    this.pendingTasks = 0;
    this.config = {};
    this.taskList = {};
    this.report = {
        invalidTasks: {
            count: 0
        },
        status: {}
    };
    this.previousReport;
    this.validTasks = {};
};

