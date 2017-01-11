class Nickname extends React.Component{
	constructor(props){
	  super(props)
	  this.state={nickname:'登录'}
	}
	componentDidMount(){
	  this.request=$.get(this.props.url,function(data){
	  console.log(data);
	  	this.setState({nickname:data.nickname})
	  }.bind(this))
	  
	}
	  componentWillUnmount(){
	    this.request.abort();
	  }
	  render(){
		  return (
	        <div> 
	         <a href="register1.html">注册</a>
	         <a href="login1.html">
	         {this.state.nickname}
	         </a>
	        </div>
		  )
	  }
	}
	ReactDOM.render(
   <Nickname url="/user/info" />,
   document.getElementById('title')
	)

