

$(function() {
	var url = 'http://localhost:8080';
	var socket = null;
	initUsers();

	$('#push').on('click', function() {
		pushNews();
		return false;
	});

	$('#switchUser').on('change', function() {
		$('#user').val($(this).val());
		reconnectSocket($('#user').val());	
	});

	$('#setting').on('click', function() {subscribeSetting();});
	
	function connectSocket(user) {
		socket = io(url, {'reconnect':true,'auto connect':true,'force new connection':true});
		socket.on('connect', function() {
			//连接成功后传递用户信息，用户ID作为客户端唯一标识
		  	socket.emit('online', {user: user});
			socket.on('news', function (data) {
			    $.tips({
			    	selector: '.tip-holder',
			    	maxNum: 3,
			    	data: data,
			    	close: function($this) {
			    		var $this = $(this);
						var id = $(this).siblings('p[data-_id]').text();
						removeNews(id, function() {
							$this.parent('.dialog').slideUp(function() {$(this).remove();});
						});
			    	}
			    });
			});
		});
	}


	function pushNews() {
		var data = {
			'user': $('#user').val(),
			'type': $('#type').val(),
			'title': $('#title').val(),
			'content': $('#content').val()
		};
		$.ajax({
			dataType: 'jsonp',
			url: url + '/setinfo',
			data: data,
			success: function(data) {
				console.log(data);
			},
			error: function(err) {
				console.log(err);
			}
		});
	}

	function initUsers() {
		$.ajax({
			dataType: 'jsonp',
		    url: url + '/news/getusers',
		    success: function(data) {
		      if (data) {
		        var option = '';
		        for (var i = 0, j = data.data.length; i < j; i++) {
		          var item = data.data;
		          option += '<option value="'+item[i].user+'">'+item[i].user+'</option>'
		        }
		        $('#switchUser').html(option);
		        connectSocket($('#user').val());
		      }
		    },
		    error: function(err) {
		      console.log(err);
		    }
		});
	}
	

	

	function reconnectSocket(user) {
		if (socket) {
			socket.disconnect();	
		}
		connectSocket(user);
	}

	//权限设置
	function subscribeSetting() {
		$.ajax({
		  dataType: 'jsonp',
		  url: url + '/subscribe/setting',
		  data: {
		    'user': $('#user').val(),
		    'inquirys': $('#inquirys').is(':checked'),
		    'orders': $('#orders').is(':checked'),
		    'returns': $('#returns').is(':checked')
		  },
		  success: function(data) {
		    console.log(data);
		  },
		  error: function(err) {
		    console.log(err);
		  }
		});
	}

	//删除
	function removeNews(id, cb) {
		//单条删除
		if (id) {
			$.ajax({
				dataType: 'jsonp',
				url: url + '/item/remove/' + id,
				success: function(data) {
					$('[data-id="'+id+'"]').parent('div').remove();
					if (cb) {
						cb();
					}
				},
				error: function(err) {
					console.log(err);
				}
			});
		}
	}

});