module.exports = function(RED) {
	const XLSX = require('xlsx');

	function convertHeaderParam(value) {
		switch (value) {
			case "1": return 1;
			case "A": return "A";
			default: return undefined;
		}
	}

	function SheetToJsonNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg) {
			var option = {
				raw: config.raw == "true",
				range: config.range || "!ref",
				header: convertHeaderParam(config.header),
				dateNF: undefined,
				defval: undefined,
				blankrows: config.blankrows == "true"
			};
			msg.payload = XLSX.utils.sheet_to_json(msg.payload, option);
			node.send(msg);
		});
	}
	RED.nodes.registerType("sheet-to-json",SheetToJsonNode);
}
