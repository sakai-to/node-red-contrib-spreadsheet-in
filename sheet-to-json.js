module.exports = function(RED) {
	const XLSX = require('xlsx');

	function SheetToJsonNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg) {
			var option = {
				raw: false,
				range: config.range || "!ref",
				header: undefined,
				dateNF: undefined,
				defval: undefined,
				blankfows: undefined
			};
			msg.payload = XLSX.utils.sheet_to_json(msg.payload, option);
			node.send(msg);
		});
	}
	RED.nodes.registerType("sheet-to-json",SheetToJsonNode);
}
