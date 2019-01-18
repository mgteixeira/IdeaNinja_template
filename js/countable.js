(function(global){let liveElements=[]
const each=Array.prototype.forEach
function decode(string){const output=[]
let counter=0
const length=string.length
while(counter<length){const value=string.charCodeAt(counter++)
if(value>=0xD800&&value<=0xDBFF&&counter<length){const extra=string.charCodeAt(counter++)
if((extra&0xFC00)==0xDC00){output.push(((value&0x3FF)<<10)+(extra&0x3FF)+0x10000)}else{output.push(value)
counter--}}else{output.push(value)}}
return output}
function validateArguments(elements,callback){const nodes=Object.prototype.toString.call(elements)
const elementsValid=(nodes==='[object NodeList]'||nodes==='[object HTMLCollection]')||elements.nodeType===1
const callbackValid=typeof callback==='function'
if(!elementsValid)console.error('Countable: Not a valid target')
if(!callbackValid)console.error('Countable: Not a valid callback function')
return elementsValid&&callbackValid}
function count(element,options){let original=''+('value' in element?element.value:element.textContent)
options=options||{}
if(options.stripTags)original=original.replace(/<\/?[a-z][^>]*>/gi,'')
if(options.ignore){each.call(options.ignore,function(i){original=original.replace(i,'')})}
const trimmed=original.trim()
return{paragraphs:trimmed?(trimmed.match(options.hardReturns?/\n{2,}/g:/\n+/g)||[]).length+1:0,sentences:trimmed?(trimmed.match(/[.?!…]+./g)||[]).length+1:0,words:trimmed?(trimmed.replace(/['";:,.?¿\-!¡]+/g,'').match(/\S+/g)||[]).length:0,characters:trimmed?decode(trimmed.replace(/\s/g,'')).length:0,all:decode(original).length}}
const Countable={on:function(elements,callback,options){if(!validateArguments(elements,callback))return
if(elements.length===undefined){elements=[elements]}
each.call(elements,function(e){const handler=function(){callback.call(e,count(e,options))}
liveElements.push({element:e,handler:handler})
handler()
e.addEventListener('input',handler)})
return this},off:function(elements){if(!validateArguments(elements,function(){}))return
if(elements.length===undefined){elements=[elements]}
liveElements.filter(function(e){return elements.indexOf(e.element)!==-1}).forEach(function(e){e.element.removeEventListener('input',e.handler)})
liveElements=liveElements.filter(function(e){return elements.indexOf(e.element)===-1})
return this},count:function(elements,callback,options){if(!validateArguments(elements,callback))return
if(elements.length===undefined){elements=[elements]}
each.call(elements,function(e){callback.call(e,count(e,options))})
return this},enabled:function(elements){if(elements.length===undefined){elements=[elements]}
return liveElements.filter(function(e){return elements.indexOf(e.element)!==-1}).length===elements.length}}
if(typeof exports==='object'){module.exports=Countable}else if(typeof define==='function'&&define.amd){define(function(){return Countable})}else{global.Countable=Countable}}(this))