(() => {
  const DAY=['sun','mon','tue','wed','thu','fri','sat'];
  const mins=s=>{const [h,m]=String(s).split(':').map(Number);return h*60+(m||0)};
  function activeRange(ranges=[],date=new Date()){
    const now=date.getHours()*60+date.getMinutes();
    for(const range of ranges){
      const [a,b]=range; const start=mins(a), end=mins(b);
      if(start===end)return {open:true,range};
      if(end>start && now>=start && now<end)return {open:true,range};
      if(end<start && (now>=start || now<end))return {open:true,range};
    }
    return {open:false,range:null};
  }
  function scheduleFor(hours,date=new Date()){
    if(!hours)return [];
    if(Array.isArray(hours))return hours;
    return hours[DAY[date.getDay()]]||[];
  }
  function resolve(place={},venue=null,date=new Date()){
    if(place.hours){
      const ranges=scheduleFor(place.hours,date);
      return {level:'shop',label:'店舖時間',hours:place.hours,ranges,...activeRange(ranges,date),confirmed:true};
    }
    if(venue?.foodCourtHours){
      const ranges=scheduleFor(venue.foodCourtHours,date);
      return {level:'food_court',label:'Food Court 時間',hours:venue.foodCourtHours,ranges,...activeRange(ranges,date),confirmed:false};
    }
    if(venue?.hours){
      const ranges=scheduleFor(venue.hours,date);
      const label=venue.type==='night_market'?'夜市開放時間':venue.type==='traditional_market'||venue.type==='cooked_food_centre'?'街市／熟食中心時間':'場地開放時間';
      return {level:'venue',label,hours:venue.hours,ranges,...activeRange(ranges,date),confirmed:false};
    }
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
