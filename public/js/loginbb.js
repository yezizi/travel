$(function () {
   Cookies.remove('user')
  $('#login').on('click', function () {
    var c;
    var d;
    var er;
    
    c=$('#account').val();
    d=$('#password').val();
   
    //d=document.getElementById('password').value;
    //e=document.getElementById('password2').value;
     if (c==''||d==''){
      alert('请把信息填写完整')
      return;
    }  
    $.ajax({
      url: 'login',
      data: {
        account: $('#account').val(),
        password: $('#password').val()
      },
      type: 'post',      
      dataType:'json',
      success: function (data, status, xhr) {

        if (data.message == 'OK') {
          alert('login');
          
         Cookies.set('user',data.userId);
          //console.log(data)
          //console.log(user);
         window.location.href = 'indexbf.html';
       

        } else {
          alert('账号或密码错误');
        }
      },
      error: function (xhr, status, data) {
        console.log(data);
        alert('服务器错误');
      }
    });
  });
});
