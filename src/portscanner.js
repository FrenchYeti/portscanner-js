var PortScanner = {};

PortScanner.scanPort = function (callbackSuccess, callbackError, target, port, timeout) {
 var timeout = (timeout == null)? 500 : timeout;
 var img = new Image();
     
 img.onerror = function () {
  if (!img) return;
  img = undefined;
  callbackSuccess(target, port, 'open');
 };
 
 img.onload = img.onerror;
 img.src = 'http://' + target + ':' + port;
 
 
 setTimeout(function () {
  if (!img) return;
  img = undefined;
  callbackError(target, port, 'closed');
 }, timeout);
  
};

PortScanner.scanTarget = function (callbackSuccess, callbackError, target, ports, timeout)
{
 for (index = 0; index < ports.length; index++)
  PortScanner.scanPort(callbackSuccess, callbackError, target, ports[index], timeout);
}; 
