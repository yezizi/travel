
  function Sceneryy(props) {
    return(
    <div className="col-lg-8">
    {this.state.list.map((scene) =>
      <div className="panel">
      <img src="{scene.pic_1}"/></img>
      <ul>
        <li>
           <a href="scenery.html?id={id}">
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