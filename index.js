var MirrorStream = require("mirrorstream");

function StreamBuffer(cb){
	MirrorStream.call(this);

	this._chunks = [];
	this._cb = cb;
	this.length = 0;

	var t = this;
	this.on("error", function(e){
		if(t._cb) t._cb(e);
		t._cb = null;
	});
}

require("util").inherits(StreamBuffer, MirrorStream);

StreamBuffer.prototype.write = function(c){
	this._chunks.push(c);
	this.length += c.length;
	MirrorStream.prototype.write.call(this, c);
};

StreamBuffer.prototype.end = function(c){
	MirrorStream.prototype.end.call(this, c);
	if(this._cb){
		this._cb(null, Buffer.concat(this._chunks, this.length));
		this._cb = null;
	}
};

module.exports = StreamBuffer;