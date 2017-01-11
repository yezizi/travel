///////////////////////////显示搜索框
class Search extends React.Component{
    constructor(props){
    super(props)
    this.state={list:[]}
    console.log(search)
    }

   
    click(){
       var _s=$('#s').val()
       if(_s=='1'){
        this.request=$.post('wad/search',{search: $('#input').val()},function(data){
        this.setState({list:data})
        }.bind(this))
       } 
       else if(_s=='2'){
        this.request=$.post('scenery/search',{search: $('#input').val()},function(data){
        this.setState({list:data})
        }.bind(this))
       }
    }

    render(){
      //let e=null
      // if (_s=='1'){
      //   e=<Foodd />
      // }
      // else if(_s=='2'){
      //   e=<sceneryy />
      // }
      return(
        <div>
          <input type="text" className="form-control" id="input"></input> 
          <select id="s">
              <option value="1">美食</option>
              <option value="2">景点</option>
          </select>
          <button id="submit" onClick={this.click.bind(this)}>搜索</button>
        </div>
      )   
    }
}
ReactDOM.render(
<Search />,
document.getElementById('search')
)


///////////////////////////显示数据部分


class Lookfor extends React.Component{
  constructor(props){
  super(props)
  this.state={list:[]}
  }

  componentDidMount(){
    var s=Arg('search'); 
    var _s=$('#s').val() 
    console.log(s); 
    var pp=document.getElementById('input');
    pp.value =s;
    //var pp=$('#input').val();
     //pp.value =s;
    if(s){
      if (Arg('type')=='food'){
        this.request=$.post('wad/search',{search: s},function(data){
        console.log(data)
        this.setState({list:data})
        }.bind(this))
      }
      else if(Arg('type')=='scenery'){
        this.request=$.post('scenery/search',{search: s},function(data){
        console.log(data)
        this.setState({list:data})
        }.bind(this))
      }
    }           
  }
  componentWillUnmount(){
      this.request.abort()
  }
  
  function Sceneryy(props) {
    return(
    <div className="col-lg-8">
    {this.state.list.map((scene) =>
      <div className="panel">
      <img src="{scene.pic_1}"/></img>
      <ul>
        <li>
           <a href="scenery.html?id={scene.id}">
          {scene.name}
          </a>
        </li>
        <li><p>{scene.location}</p></li>
      </ul>   
      </div>
    )}
    </div>
    )
  }
  function Foodd(props) {
    return(
        <div className="col-lg-8">
         {this.state.list.map((food) =>
          <div className="panel">
          <img src="{food.pic_1}"></img>
          <ul>
            <li>
              <a href="food.html?id={{food.id}}">
              {food.name}
              </a>
            </li>
            <li><p>{food.taste}</p></li>
            <li><p>{food.propose}</p></li>
            <li><p>{food.area}</p></li>
          </ul> 
          </div>
          )} 
        </div>
    )
  }
  render(){
    let e=null
    if (Arg('type')=='food'||_s=='1'){
      e=<Foodd />
    }
    else if(Arg('type')=='scenery'||_s=='2'){
      e=<Sceneryy />
    }
    return
    (
      <div>
      {e}
      </div>
    )
  }
}
ReactDOM.render(
    <Lookfor  />,
    document.getElementById('list')
)

