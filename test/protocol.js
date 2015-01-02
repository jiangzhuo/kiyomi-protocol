var Protocol = require('../');
var test = require("test");
test.setup();
var Package = Protocol.Package;
var Message = Protocol.Message;

describe('Kiyomi protocol test', function () {
    describe('String encode and decode', function () {
        it('expect be ok to encode and decode Chinese string', function () {
            var str = '你好, abc~~~';
            var buf = Protocol.strencode(str);
            assert.exist(buf);
            assert.equal(str, Protocol.strdecode(buf));
        });
    });

    describe('Package encode and decode', function () {
        it('expect keep the same data after encoding and decoding', function () {
            var msg = 'hello world~';
            var buf = Package.encode(Package.TYPE_DATA, Protocol.strencode(msg));
            assert.exist(buf);
            var res = Package.decode(buf);
            assert.exist(res);
            assert.equal(Package.TYPE_DATA, res.type);
            assert.exist(res.body);
            assert.equal(msg, Protocol.strdecode(res.body));
        });

        it('expect ok when encoding and decoding package without body', function () {
            var buf = Package.encode(Package.TYPE_HANDSHAKE);
            assert.exist(buf);
            var res = Package.decode(buf);
            assert.exist(res);
            assert.equal(Package.TYPE_HANDSHAKE, res.type);
            assert.notExist(res.body);
        });
    });

    describe('Message encode and decode', function () {
        it('expect be ok for encoding and decoding request', function () {
            var id = 128;
            var compress = 0;
            var route = 'connector.entryHandler.entry';
            var msg = 'hello world~';
            var buf = Message.encode(id, Message.TYPE_REQUEST, compress,
                route, Protocol.strencode(msg));
            assert.exist(buf);
            var res = Message.decode(buf);
            assert.exist(res);
            assert.equal(id, res.id);
            assert.equal(Message.TYPE_REQUEST, res.type);
            assert.equal(compress, res.compressRoute);
            assert.equal(route, res.route);
            assert.exist(res.body);
            assert.equal(msg, Protocol.strdecode(res.body));
        });

        it('expect be ok for encoding and decoding empty route', function () {
            var id = 256;
            var compress = 0;
            var route = '';
            var msg = 'hello world~';
            var buf = Message.encode(id, Message.TYPE_REQUEST, compress,
                route, Protocol.strencode(msg));
            assert.exist(buf);
            var res = Message.decode(buf);
            assert.exist(res);
            assert.equal(id, res.id);
            assert.equal(Message.TYPE_REQUEST, res.type);
            assert.equal(compress, res.compressRoute);
            assert.equal(route, res.route);
            assert.exist(res.body);
            assert.equal(msg, Protocol.strdecode(res.body));
        });

        it('expect be ok for encoding and decoding null route', function () {
            var n = Math.floor(10000 * Math.random());
            var id = 128 * n;
            var compress = 0;
            var route = null;
            var msg = 'hello world~';
            var buf = Message.encode(id, Message.TYPE_REQUEST, compress,
                route, Protocol.strencode(msg));
            assert.exist(buf);
            var res = Message.decode(buf);
            assert.exist(res);
            assert.equal(id, res.id);
            assert.equal(Message.TYPE_REQUEST, res.type);
            assert.equal(compress, res.compressRoute);
            assert.equal(res.route, '');
            assert.exist(res.body);
            assert.equal(msg, Protocol.strdecode(res.body));
        });

        it('expect be ok for encoding and decoding compress route', function () {
            var id = 256;
            var compress = 1;
            var route = 3;
            var msg = 'hello world~';
            var buf = Message.encode(id, Message.TYPE_REQUEST, compress,
                route, Protocol.strencode(msg));
            assert.exist(buf);
            var res = Message.decode(buf);
            assert.exist(res);
            assert.equal(id, res.id);
            assert.equal(Message.TYPE_REQUEST, res.type);
            assert.equal(compress, res.compressRoute);
            assert.equal(route, res.route);
            assert.exist(res.body);
            assert.equal(msg, Protocol.strdecode(res.body));
        });

        it('expect be ok for encoding and decoding mutil-bytes id', function () {
            var id = Math.pow(2, 30);
            var compress = 1;
            var route = 3;
            var msg = 'hello world~';
            var buf = Message.encode(id, Message.TYPE_REQUEST, compress,
                route, Protocol.strencode(msg));
            assert.exist(buf);
            console.log(buf);
            var res = Message.decode(buf);
            assert.exist(res);
            assert.equal(id, res.id);
            assert.equal(Message.TYPE_REQUEST, res.type);
            assert.equal(compress, res.compressRoute);
            assert.equal(route, res.route);
            assert.exist(res.body);
            assert.equal(msg, Protocol.strdecode(res.body));
        });

        it('expect be ok for encoding and decoding notify', function () {
            var compress = 0;
            var route = 'connector.entryHandler.entry';
            var msg = 'hello world~';
            var buf = Message.encode(0, Message.TYPE_NOTIFY, compress,
                route, Protocol.strencode(msg));
            assert.exist(buf);
            var res = Message.decode(buf);
            assert.exist(res);
            assert.equal(res.id, 0);
            assert.equal(Message.TYPE_NOTIFY, res.type);
            assert.equal(compress, res.compressRoute);
            assert.equal(route, res.route);
            assert.exist(res.body);
            assert.equal(msg, Protocol.strdecode(res.body));
        });

        it('expect be ok for encoding and decoding response', function () {
            var id = 1;
            var compress = 0;
            var msg = 'hello world~';
            var buf = Message.encode(id, Message.TYPE_RESPONSE, compress,
                null, Protocol.strencode(msg));
            assert.exist(buf);
            var res = Message.decode(buf);
            assert.exist(res);
            assert.equal(id,res.id);
            assert.equal(Message.TYPE_RESPONSE,res.type);
            assert.equal(compress,res.compressRoute);
            assert.notExist(res.route);
            assert.exist(res.body);
            assert.equal(msg,Protocol.strdecode(res.body));
        });

        it('expect be ok for encoding and decoding push', function () {
            var compress = 0;
            var route = 'connector.entryHandler.entry';
            var msg = 'hello world~';
            var buf = Message.encode(0, Message.TYPE_PUSH, compress,
                route, Protocol.strencode(msg));
            assert.exist(buf);
            var res = Message.decode(buf);
            assert.exist(res);
            assert.equal(res.id,0);
            assert.equal(Message.TYPE_PUSH,res.type);
            assert.equal(compress,res.compressRoute);
            assert.equal(route,res.route);
            assert.exist(res.body);
            assert.equal(msg,Protocol.strdecode(res.body));
        });

    });
});
