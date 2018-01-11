module.exports={
writeSSEHead : function (req, res, cb) {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
  
    res.write("retry: 10000\n");
    return cb(req, res);
},
  writeSSEData : function (req, res, event, data, cb) {
    //if (parseInt(data)>0){
    var id = (new Date()).toLocaleTimeString();
    res.write("id: " + id + '\n');
    res.write("event: " + event + "\n");
    console.log(data);
    res.write("data: " + JSON.stringify(data) + "\n\n");
    //}
    if (cb) {
        return cb(req, res);
    }
}
}