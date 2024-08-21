import "./AppSearch.css"

function AppSearch(props)  {
     const {value,onValueChange} =props;
     
    return (

<div  className="app-search">

<input
   className="app-searh-input"
   type="text"
   
   placeholder="ค้นหาสิ"
   value={value}
   onChange={(event)=>{onValueChange(event.target.value)}}

   
/>
</div>

);

}
export default AppSearch;