import "./AppPost.css";

function AppPost(props){
      const {tattoo,onBgClick} = props ;
    return (
           <div className="App-post">
                <div className="App-post-bg" onClick={onBgClick }/>
                <div className="App-post-content">  
                <img src={tattoo.fullUrl}/>
                  
                    <h4>{tattoo.title}</h4>
                </div>

           </div>
    )    
}
export default AppPost;
