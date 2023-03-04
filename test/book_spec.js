var should = require("should");
var helper = require("node-red-node-test-helper");
var bookNode = require("../book.js");
var fs = require("fs");

helper.init(require.resolve('node-red'));

describe('book Node', function () {

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
        var flow = [{ id: "n1", type: "book", name: "book1" }];
        helper.load(bookNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'book1');
            done();
        });
    });

    it('should parse data of a spreadsheet', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];
        helper.load(bookNode, flow, function () {
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                msg.should.have.propertyByPath('payload', 'SheetNames').eql(['Sheet1']);
                done();
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/example.xlsx");
            n1.receive({ payload: data });
        });
    });

    it('should parse date values of a spreadsheet', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];
        helper.load(bookNode, flow, function () {
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                try {
                    msg.should.have.propertyByPath('payload', 'Sheets', 'Sheet1', 'A2', 'w').equal('2020/08/01');
                    msg.should.have.propertyByPath('payload', 'Sheets', 'Sheet1', 'B2', 'w').equal('2020/08/01 0:00:00');
                    done();
                } catch (e) {
                    done(e);
                }
            });
            var n1 = helper.getNode("n1");
            var data = fs.readFileSync(__dirname + "/time_issue.xlsx");
            n1.receive({ payload: data });
        });
    });

    it('should parse data of a csv file', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];
        helper.load(bookNode, flow, function () {
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                try {
                    msg.should.have.propertyByPath('payload', 'Sheets', 'Sheet1', 'A2', 'v').equal(44021.83341435185 - new Date().getTimezoneOffset() / 60 / 24);
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

    it('should not parse data of a csv file', function (done) {
        var flow = [
            { id: "n1", type: "book", name: "book1", wires: [["n2"]], raw: true },
            { id: "n2", type: "helper" }
        ];
        helper.load(bookNode, flow, function () {
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                try {
                    msg.should.have.propertyByPath('payload', 'Sheets', 'Sheet1', 'A2', 'v').equal('2020-07-09T20:00:07.000Z');
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
