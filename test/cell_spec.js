var should = require("should");
var helper = require("node-red-node-test-helper");
var bookNode = require("../book.js");
var sheetNode = require("../sheet.js");
var cellNode = require("../cell.js");
var fs = require("fs");

helper.init(require.resolve('node-red'));

describe('cell Node', function () {

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
        var flow = [{ id: "n1", type: "cell", name: "cell1" }];
        helper.load(cellNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'cell1');
            done();
        });
    });

    it('should pick the cell value specified in node config', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "cell", name: "cell1", wires: [["n4"]], address: "A1", dataType: "w" },
            { id: "n4", type: "helper" }
        ];
        helper.load([bookNode, sheetNode, cellNode], flow, function () {
            var n4 = helper.getNode("n4");
            n4.on("input", function (msg) {
                msg.should.have.property('payload', 'col1');
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data });
        });
    });

    it('should pick the cell type specified in node config', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "cell", name: "cell1", wires: [["n4"]], address: "A1", dataType: "t" },
            { id: "n4", type: "helper" }
        ];
        helper.load([bookNode, sheetNode, cellNode], flow, function () {
            var n4 = helper.getNode("n4");
            n4.on("input", function (msg) {
                msg.should.have.property('payload', 's');
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data });
        });
    });

    it('should pick the cell value specified in msg object', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "cell", name: "cell1", wires: [["n4"]], address: "", dataType: "w" },
            { id: "n4", type: "helper" }
        ];
        helper.load([bookNode, sheetNode, cellNode], flow, function () {
            var n4 = helper.getNode("n4");
            n4.on("input", function (msg) {
                msg.should.have.property('payload', 'col1');
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data, selectAddress: "A1" });
        });
    });

});
