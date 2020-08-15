var should = require("should");
var helper = require("node-red-node-test-helper");
var bookNode = require("../book.js");
var sheetNode = require("../sheet.js");
var sheetToJsonNode = require("../sheet-to-json.js");
var fs = require('fs');

helper.init(require.resolve('node-red'));

describe('sheet-to-json Node', function () {

    before(function (done) {
        helper.startServer(done);
    });

    after(function (done) {
        helper.stopServer(done);
    });

    afterEach(function () {
        helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{ id: "n1", type: "sheet-to-json", name: "sheet-to-json1" }];
        helper.load(sheetToJsonNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'sheet-to-json1');
            done();
        });
    });

    it('should convert a whole sheet object to an array of JSON objects', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "sheet-to-json", name: "sheet-to-json1", wires: [["n4"]], raw: "false", range: "", header: "default", blankrows: false },
            { id: "n4", type: "helper" }
        ];
        helper.load([bookNode, sheetNode, sheetToJsonNode], flow, function () {
            var n4 = helper.getNode("n4");
            n4.on("input", function (msg) {
                msg.should.have.property('payload').eql([
                    { col1: "1", col2: "2", col3: "3" },
                    { col1: "4", col2: "5", col3: "6" }
                ]);
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data });
        });
    });

    it('should convert a whole sheet object to an array of JSON objects with raw values', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "sheet-to-json", name: "sheet-to-json1", wires: [["n4"]], raw: "true", range: "", header: "default", blankrows: false },
            { id: "n4", type: "helper" }
        ];
        helper.load([bookNode, sheetNode, sheetToJsonNode], flow, function () {
            var n4 = helper.getNode("n4");
            n4.on("input", function (msg) {
                msg.should.have.property('payload').eql([
                    { col1: 1, col2: 2, col3: 3 },
                    { col1: 4, col2: 5, col3: 6 }
                ]);
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data });
        });
    });

    it('should convert the range of sheet specified in node config to an array of JSON objects with raw values', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "sheet-to-json", name: "sheet-to-json1", wires: [["n4"]], raw: "true", range: "A1:B3", header: "default", blankrows: false },
            { id: "n4", type: "helper" }
        ];
        helper.load([bookNode, sheetNode, sheetToJsonNode], flow, function () {
            var n4 = helper.getNode("n4");
            n4.on("input", function (msg) {
                msg.should.have.property('payload').eql([
                    { col1: 1, col2: 2 },
                    { col1: 4, col2: 5 }
                ]);
                msg.should.have.property('selectedRange', "A1:B3");
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data });
        });
    });

    it('should convert the range of sheet specified in msg object to an array of JSON objects with raw values', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "sheet-to-json", name: "sheet-to-json1", wires: [["n4"]], raw: "true", range: "", header: "default", blankrows: false },
            { id: "n4", type: "helper" }
        ];
        helper.load([bookNode, sheetNode, sheetToJsonNode], flow, function () {
            var n4 = helper.getNode("n4");
            n4.on("input", function (msg) {
                msg.should.have.property('payload').eql([
                    { col1: 1, col2: 2 },
                    { col1: 4, col2: 5 }
                ]);
                msg.should.have.property('selectedRange', "A1:B3");
                msg.should.not.have.property('selectRange');
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data, selectRange: "A1:B3" });
        });
    });

    it('should convert the whole sheet obejct to an array of arrays', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "sheet-to-json", name: "sheet-to-json1", wires: [["n4"]], raw: "true", range: "", header: "1", blankrows: false },
            { id: "n4", type: "helper" }
        ];
        helper.load([bookNode, sheetNode, sheetToJsonNode], flow, function () {
            var n4 = helper.getNode("n4");
            n4.on("input", function (msg) {
                msg.should.have.property('payload').eql([
                    ["col1", "col2", "col3"],
                    [1, 2, 3],
                    [4, 5, 6]
                ]);
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data });
        });
    });

    it('should convert the whole sheet obejct to an array of row objects that keys are literal column labels', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "sheet-to-json", name: "sheet-to-json1", wires: [["n4"]], raw: "true", range: "", header: "A", blankrows: false },
            { id: "n4", type: "helper" }
        ];
        helper.load([bookNode, sheetNode, sheetToJsonNode], flow, function () {
            var n4 = helper.getNode("n4");
            n4.on("input", function (msg) {
                msg.should.have.property('payload').eql([
                    { A: "col1", B: "col2", C: "col3" },
                    { A: 1, B: 2, C: 3 },
                    { A: 4, B: 5, C: 6 }
                ]);
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data });
        });
    });

    it('should convert a whole CSV values to an array of JSON objects, with the exact strings written in CSV file', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]], raw: true },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "sheet-to-json", name: "sheet-to-json1", wires: [["n4"]], raw: true, range: "", header: "default", blankrows: false },
            { id: "n4", type: "helper" }
        ];
        helper.load([bookNode, sheetNode, sheetToJsonNode], flow, function () {
            var n4 = helper.getNode("n4");
            n4.on("input", function (msg) {
                try {
                    msg.should.have.property('payload').eql([
                        {
                            Timestamp: "2020-07-09T20:00:07.000Z",
                            Humidity: "37.57400131",
                            Pressure: "992.5411987",
                            PM1: "16.66666667",
                            PM2_5: "21",
                            PM10: "21.66666667",
                            Temperature: "35.34999847",
                            DateTime: "1594324807.00",
                        }
                    ]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/time_issue.csv");
            n1.receive({ payload: data });
        });
    });

});
