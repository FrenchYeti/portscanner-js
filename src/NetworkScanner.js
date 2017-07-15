var PortScanner = {
    // pro : support all type of remote resource
    // cons : time depend, max time = nb_target * nb_ports_per_target * timeout(500ms)
    TIMEOUT_SCAN: 0,
    // pro : more faster  
    // cons : don't support image/audio/video files, don't support image-based signatures
    SCRIPT_SCAN: 1,  
    // Thx to Gareth Hayes
    // Copied from LanScanner BeEF plugin
    SIGNATURES: {
        ips: [],
        models: []
    },
    // Timeout, when the type of scan is TIMEOUT_SCAN (in ms)
    TIMEOUT: 500,
    // event = { type:[start|success|fail|end], data:{target,ip,status, ...} }
    _callBacks: {
        start: null,
        success: null,
        fail: null,
        end: null,
    },
    trigger: function(evt,data){
        if(PortScanner._callBacks != undefined 
            && PortScanner._callBacks[evt] instanceof Function){
            PortScanner._callBacks[evt](data);
        }else{
           console.log("Invalid callback");
        } 
    },
    targets: {
        queue: [],
        results: []
    }      
};

var PS = PortScanner;


// add a target/port to scan to the queue
PS.addPortToQueue = function(target,port){s
   if(PS.targets.queue[target] == undefined){
        PS.targets.queue[target] = {ip:target, ports:[]};        
   }
   PS.targets.queue[target].open.push(port);
};

// save a target/port open
PS.newPortOpen = function(target,port){
   if(PS.targets.results[target] == undefined){
        PS.targets.results[target] = {ip:target, open:[], counter:0};        
   }
   PS.targets.results[target].open.push(port);
};


// set the type of scan (img-based or script-based)
PS.setScanType = function(type_scan){
    if(type_scan == PS.TIMEOUT_SCAN || type_scan == PS.SCRIPT_SCAN)
        PS.tscanner = type_scan;
};

/**
* Scan a port
*/
PS.scanners.scanPort = function (target, port) {
     let img=null, timeout = (timeout == null)? 500 : timeout;
       
    if(PS.tscanner == PortScanner.TIME_BASED){
        img = new Image();     
        img.onerror = function () {
        if (!img) return;
            img = undefined;
            PS.newPortOpen(target,port);
            PS.trigger('success',{target:target, port:port, status:'open'});
        };

        img.onload = img.onerror;
        img.src = target + ':' + port;

        setTimeout(function () {
            if (!img) return;
            img = undefined;
            PS.trigger('fail',{target:target, port:port, status:'closed'});
        }, timeout); 
          
    }else if(PS.tscanner == PortScanner.SCRIPT_BASED){
          s = document.createElement("script");
          s.type="text/javascript";
          s.onload=()=>{             
            PS.newPortOpen(target,port);
            PS.trigger('success',{target:target, port:port, status:'open'}) };
          s.onerror=()=>{ 
            PS.trigger('fail',{target:target, port:port, status:'close'}) };
          s.src=target+":"+i+"/"; // existe => déclenche "success"
          document.body.append(s);
    }       
};


// scan all specified port  of a target
PS.scanners.scanTarget = function (targets, ports)
{
    for(let t in targets){
        // queue the target's ports
        // necessary for calculate the coverage 
        for(let p in ports)  PS.addPortToQueue(targets[t],ports[i]);

        // run
        for(p in ports){
            PS.scanners.scanPort(t, ports[i]);
        }
    }
}; 

