module.exports = function(RED) {
	const XLSX = require('xlsx');

	function CellNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg) {
			var cell = msg.payload && msg.payload[config.address];
			msg.payload = cell && cell.w && cell.v;
			node.send(msg);
		});
	}
	RED.nodes.registerType("cell",CellNode);
}
