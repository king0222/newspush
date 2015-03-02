/** usage:
$.tips({
	content: '',
	class: 'tip-holder',
	maxNum: 3
})
*/
$.tips = function(options) {
	var defaults = {
		selector: '#tipHolder',
		maxNum: 3,
		autoClose: false,
		showTime: 5
	};
	var opts=$.extend({}, defaults, options);
    var o = $.meta ? $.extend({}, opts, $(this).data()) : opts;
    if (!$(o.selector).length) {
    	if (o.selector.indexOf('#') != -1) {
    		$('<div id="'+o.selector.slice(1)+'"></div>').appendTo('body');	
    	} else if (o.selector.indexOf('.') != -1) {
    		$('<div class="'+o.selector.slice(1)+'"></div>').appendTo('body');
    	} else {
    		$('<'+o.selector+'></'+o.selector+'>').appendTo('body');
    	}    	
    }
    var $tipHolder = $(o.selector);
    if (o.data && o.data.data.length) {
    	var data = o.data;
    	if ($tipHolder.is(':visible')) {
	    	var $divs = createTips(data.data[0]);
		    $tipHolder.prepend($divs.hide());
		    if ($tipHolder.find('.dialog').length > o.maxNum) {
		    	$tipHolder.find('.dialog:nth-child(n+'+(o.maxNum+1)+')').slideUp(function(){$(this).remove();});
		    }
		    $divs.slideDown();
		    if (o.autoClose) {
		    	setTimeout(function() {$divs.slideUp(function(){$divs.remove();})}, (o.showTime ? (o.showTime * 1000) : 5000));
		    }
	    } else {
	    	var divs = '';
		    for (var i = 0; i < data.data.length; i ++) {
		    	if (i < o.maxNum) {
		    		$tipHolder.append(createTips(data.data[i])).slideDown();
		    	} else {
		    		break;
		    	}		    	
		    }
		    if (o.autoClose) {
		    	setTimeout(function() {$divs.slideUp(function(){$divs.remove();})}, (o.showTime ? (o.showTime * 1000) : 5000));
		    }
	    }	
    }

    function createTips(item) {
    	var $close = $('<span />', {
    		'class': 'close'
    	}).text('X');

    	if ($.isFunction(o.close)) {
    		$close.on('click', function() {
    			var $this = $(this);
                o.close.call($this);
    		});
    	}

    	var $dialog = $('<div />', {
    		'class': 'dialog'
    	});

    	var temp = '';
    	for (var i in item) {
    		temp += '<p data-' + i + '="' + item[i] + '">' + item[i] + '</p>';
    	}

    	$dialog.append($close).append(temp);

    	return $dialog;
    }
    
};