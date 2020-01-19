var require = {
	deps: ["icy"],
	callback: function(icy) {
		console.log("[TRACE] !", icy);
		require(["src/icy"]);
	}
};
