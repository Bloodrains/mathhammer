factArr = new Array(1,1);
function fact(f) {
	if(f>50)return 0;
    if(factArr[f])return factArr[f];
	if(f>0){
        var ret = f*fact(f-1);
        factArr[f] = ret;
        return ret;
    }
	return 1;
}

function binom(n,k,p) {
	return fact(n)/(fact(k)*fact(n-k))*Math.pow(p,k)*Math.pow(1-p,n-k);
}

function binrow(n,p) {
	var row = new Array();
	for(var i=0;i<=n;i++)row[i] = binom(n,i,p);
	return row;
}

function binMat(n,p) {
	var mat = new Matrix(n+1,n+1,0.0);
	mat[0][0] = 1;
	for(var i=1;i<=n;i++)mat.setRow(i,binrow(i,p));
	return mat;
}

function WSprob(ws1,ws2) {
	if(ws1>ws2)return orgreater(3);
	if(ws2>2*ws1)return orgreater(5);
	return orgreater(4);
}

function STprob(S,T) {
	diff = Math.max(Math.min(S-T,3),-2);
	return orgreater(4-diff);
}

function ASprob(S,A) {
	if(isNaN(A))return 0;
	if(A==0)return 0;
	if(S<3)S=3;
	return orgreater(A+S-3);
}

function WDprob(W) {
	if(isNaN(W))return 0;
	if(W==0)W=7;
	return orgreater(W);
}

function orgreater(n) {
	if(n<2)n=2;
	return Math.max((7-n)/6,0);
}

function reroll(p) {
	return (1-(1-p)*(1-p));
}

Array.prototype.sum = function() {
  return (! this.length) ? 0 : this.slice(1).sum() +
      ((typeof this[0] == 'number') ? this[0] : 0);
};

function get(id) {
	return parseInt(document.getElementById(id).value);
}

function is(id) {
    return document.getElementById(id).checked;
}

function print_results(str) {
	document.getElementById("results").innerHTML = str;
}

function percent(x) {
	return Math.round((x-0)*100)+"%";
}

function expected(X,A) {
    var exp = 0;
    for(var i=0; i<X.length; i++)
        exp += i*X[i];
    if(A)return Math.round(1000*exp/A)/1000;
    return Math.round(100*exp)/100;
}

function doMathhammer(event) {
	var S = get("S");
	var T = get("T");
	var A = get("A");
	var W = get("W");
	var U = get("U");
	var R = get("R");
	var D = get("D");
	
	if(isNaN(S))return;
	if(isNaN(T))return;
	if(isNaN(A))return;
	if(isNaN(W))return;
	if(isNaN(U))return;

	var hitP = WSprob(W,U);
	var wndP = STprob(S,T);
	var arsP = 1 - ASprob(S,R);
	var wdsP = 1 - WDprob(D);
	if(is("hitRR"))
		hitP = reroll(hitP);
	if(is("wndRR"))
		wndP = reroll(wndP);
	if(is("poisn"))
		wndP = 1-(1-wndP)*5/6;

    var results = calculate(A,hitP,wndP,arsP,wdsP);

	var output = "Results"
    output+= "<div class='clear'>";
	for(var i=0; i<= A; ++i ) 
		output+= bar(i,results[i]);
    output += "</div>Chance of doing exactly X unsaved wounds";
		
    output+= "<div class='clear'>";
	for(var i=0; i<= A; ++i ) 
		output+= bar(i,results.slice(i).sum(),"blue");
	output +="</div>Chance of doing at least X unsaved wounds";
    output +="<br><strong>Expected # of wounds:"+expected(results)+"</strong>";
    output +="<br><strong>Expected # of wounds/atk:"+expected(results,A)+"</strong>";
	print_results(output);
} 

function calculate(A,hitP,wndP,arsP,wdsP) {
	var hitV = new Matrix(new Array(binrow(A,hitP)));
	var wndM = binMat(A,wndP);
	var arsM = binMat(A,arsP);
	var wdsM = binMat(A,wdsP);

	var wndV = hitV.multiply(wndM)
	var arsV = wndV.multiply(arsM)
	var wdsV = arsV.multiply(wdsM)

    return wdsV[0];
}

function bar(i,x,cssclass) {
    var output = "<div class='float holder'>";
    output += "<div class='bar "+cssclass+"' style='height:"+200*x+"px;'>";
    output += "</div><div class='rotate'>";
    output += i+":&nbsp;&nbsp; "+percent(x);
    output += "</div></div>"
    return output;
}

function mousewheel(event) {
		var delta = 0;
		if (!event) /* For IE. */
			 event = window.event;
		if (event.wheelDelta) { /* IE/Opera. */
			 delta = event.wheelDelta/120;
			 /** In Opera 9, delta differs in sign as compared to IE.
			  */
			 if (window.opera)
					 delta = -delta;
		} else if (event.detail) { /** Mozilla case. */
			 /** In Mozilla, sign of delta is different than in IE.
			  * Also, delta is multiple of 3.
			  */
			delta = -event.detail/3;
		}
		var el ;
        if(event.srcElement)
            el = event.srcElement;
        else if(event.currentTarget)
            el = event.currentTarget;
		var value = parseInt(el.value) + delta;
		if(el.id == "R" || el.id == "D"){
			value -= 2*delta;
			if(value == -1 && delta==1)value = 6;
			if(value == 7 && delta==-1)value = 0;
			if(value == 1 && delta==-1)value = 0;
			if(value == 0 && delta==1)value = 1;
			value = Math.max(0,value);
			value = Math.min(6,value);
		} else {
			value = Math.max(1,value);
			value = Math.min(el.id == "A"?49:10,value);
		}
		el.value = value;
		doMathhammer();
        event.preventDefault();
		return false;
}

function setup() {
	var els = document.getElementsByTagName("input");
	for(i in els)
		if(els[i].addEventListener) {
            if(els[i].getAttribute("type") == "checkbox")
			    els[i].addEventListener("change",doMathhammer,false);
			els[i].addEventListener("keyup",doMathhammer,false);
			els[i].addEventListener("mousewheel",mousewheel,false);
			els[i].addEventListener("DOMMouseScroll",mousewheel,false);
		}
		else if(els[i].attachEvent) {
            if(els[i].getAttribute("type") == "checkbox")
                els[i].attachEvent("change",doMathhammer);
			els[i].attachEvent("keyup",doMathhammer);
			els[i].attachEvent("mousewheel",mousewheel);
		}
}


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-18069361-1']);
_gaq.push(['_trackPageview']);

(function() { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
