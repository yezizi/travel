
function UserGreeting(props){
   return (
   <div> 
   <ul className="ww">
           <li>
           <a>欢迎您{props.nickname}</a></li>
           <li><a href="login1.html"> 退出登录</a></li>
   </ul>
   </div>
   )
 }
 function GuestGreeting(props){
   return (
   <div> 
           <a href="register1.html">注册</a>
           <a href="login1.html">
           登陆
           </a>
   </div>
   )
 }
 function Greeting(props){
   const isLoggedIn=props.isLoggedIn
   if (isLoggedIn){
     return <UserGreeting/>;
   }
   return <GuestGreeting />;
 }

  class LoginControl extends React.Component{
    constructor(props){
      super(props)      
      this.state={isLoggedIn:false,nickname:''}
    }
    
    componentDidMount(){
      let user =Cookies.get('user')
      if(user){
        this.request=$.get('/user/info',function(data){
        console.log(data);
          this.setState({isLoggedIn:true,nickname:data.nickname})
        }.bind(this))
      }else{
        this.setState({isLoggedIn:false,nickname:''})
      }
    }
    componentWillUnmount(){
        this.request.abort();
    }

    render(){
      const isLoggedIn =this.state.isLoggedIn
      let e=null
      if (isLoggedIn){
        e=this.state.nickname
      }else{
          e=''
      }
        return (
          <div >
           <Greeting isLoggedIn={isLoggedIn}/>
           {e}
          </div>
        )
    }
  }
  ReactDOM.render(
  <LoginControl />,
  document.getElementById('title')
  )












  