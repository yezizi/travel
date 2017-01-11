//怎样把input值传到后台，怎样触发传数据过程
//怎样点击后才能触发数据传输
class Search extends React.Component{
    constructor(props){
    super(props)
    this.danClick = this.danClick.bind(this)
    this.state={list:[]}
    console.log(search)
    }

    danClick() {
    this.setState({list:data})
    }
    componentDidMount(){
	     var _s=$('#s').val()
	     if(_s=='1'){
	      this.request=$.post('wad/search/counter',{search: $('#input').val()},function(data){
        this.setState({list:data})
        console.log(data)
        if(data.counter==1){                  
          window.location.href='food.html?id='+data.id;
        }
        else if(data.counter>1){
       // window.location.href='search.html?search='+$('#input').val()+'&type=food';
        }
      
	      }.bind(this))

        
	     } 
	     else if(_s=='2'){
	      this.request=$.post('scenery/search/counter',{search: $('#input').val()},function(data){
        this.setState({list:data})
        if(data.counter==1){                  
          window.location.href='food.html?id='+data.id;
        }
        else if(data.counter>1){
        //window.location.href='search.html?search='+$('#input').val()+'&type=food';
        }
        

	      }.bind(this))
        
	     }
    }
    componentWillUnmount(){
       this.request.abort()
    }
    render(){
      const isIn =this.state.isIn
      
      return(
        <div>
          <input type="text" className="form-control" id="input"></input> 
          <select id="s">
              <option value="1">美食</option>
              <option value="2">景点</option>
          </select>
          <button id="submit">搜索</button>
        </div>
      ) 
    }
}
ReactDOM.render(
<Search />,
document.getElementById('search')

)
