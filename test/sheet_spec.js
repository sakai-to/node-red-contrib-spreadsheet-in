var should = require("should");
var helper = require("node-red-node-test-helper");
var bookNode = require("../book.js");
var sheetNode = require("../sheet.js");
var fs = require("fs");

helper.init(require.resolve('node-red'));

describe('sheet Node', function () {

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
        var flow = [{ id: "n1", type: "sheet", name: "sheet1" }];
        helper.load(sheetNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'sheet1');
            done();
        });
    });

    it('should pick the sheet object specified in node config', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "Sheet1" },
            { id: "n3", type: "helper" }
        ];
        helper.load([bookNode, sheetNode], flow, function () {
            var n3 = helper.getNode("n3");
            n3.on("input", function (msg) {
                msg.should.have.propertyByPath('payload', '!ref').eql("A1:C3");
                msg.should.have.property('selectedSheetName', "Sheet1");
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data });
        });
    });

    it('should pick the sheet object specified in msg object', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "sheet", name: "sheet1", wires: [["n3"]], sheetName: "" },
            { id: "n3", type: "helper" }
        ];
        helper.load([bookNode, sheetNode], flow, function () {
            var n3 = helper.getNode("n3");
            n3.on("input", function (msg) {
                msg.should.have.propertyByPath('payload', '!ref').eql("A1:C3");
                msg.should.have.property('selectedSheetName', "Sheet1");
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data, selectSheetName: "Sheet1" });
        });
    });

});
