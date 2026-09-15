(() => {
  const DAY=['sun','mon','tue','wed','thu','fri','sat'];
  const mins=s=>{const [h,m]=String(s).split(':').map(Number);return h*60+(m||0)};
  function activeRange(ranges=[],date=new Date(),previousRanges=[]){
    const now=date.getHours()*60+date.getMinutes();
    for(const range of ranges){const [a,b]=range,start=mins(a),end=mins(b);if(start===end)return {open:true,range};if(end>start&&now>=start&&now<end)return {open:true,range};if(end<start&&now>=start)return {open:true,range};}
    for(const range of previousRanges){const [a,b]=range,start=mins(a),end=mins(b);if(end<start&&now<end)return {open:true,range,carriedFromPreviousDay:true};}
    return {open:false,range:null};
  }
  function schedules(hours,date=new Date()){
    if(!hours)return {today:[],previous:[]};
    if(Array.isArray(hours))return {today:hours,previous:hours};
    const d=date.getDay(),p=(d+6)%7;
    return {today:hours[DAY[d]]||[],previous:hours[DAY[p]]||[]};
  }
  function result(level,label,hours,confirmed,date){const s=schedules(hours,date);return {level,label,hours,ranges:s.today,...activeRange(s.today,date,s.previous),confirmed};}
  function resolve(place={},venue=null,date=new Date()){
    if(place.hours)return result('shop','店舖時間',place.hours,true,date);
    if(venue?.foodCourtHours)return result('food_court','Food Court 時間',venue.foodCourtHours,false,date);
    if(venue?.hours){const label=venue.type==='night_market'?'夜市開放時間':venue.type==='traditional_market'||venue.type==='cooked_food_centre'?'街市／熟食中心時間':'場地開放時間';return result('venue',label,venue.hours,false,date);}
    return {level:'unknown',label:'營業時間未有提供',hours:null,ranges:[],open:null,range:null,confirmed:false};
  }
  function displayStatus(place={},venue=null,date=new Date()){
    const r=resolve(place,venue,date);
    if(r.level==='shop')return {...r,status:r.open?'open':'closed',text:r.open?'營業中':'已休息'};
    if(r.level==='unknown')return {...r,status:'unknown',text:'營業時間未有提供'};
    return {...r,status:r.open?'venue_open':'venue_closed',text:r.open?`${r.label}：目前開放`:`${r.label}：目前關閉`};
  }
  window.CEGOVenueHours={resolve,displayStatus,activeRange};
})();
