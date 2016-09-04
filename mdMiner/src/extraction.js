const fs = require('fs'),
    async = require('async'),
    path = require('path'),
    mdextract = require('mdextract');

function Extraction() {
    this.pendingTasks = {};
    this.taskCount = 0;
    this.maxAsyncLimit = 1;
};