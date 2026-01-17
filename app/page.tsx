import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import { IEvent } from '@/database'
import { events } from '@/lib/constants'
import React from 'react'

const page = async() => {
  const res=await fetch(`${process.env.NEXT_PUBLULIC_BASE_URL}/api/events`,{cache:'no-store'});
  const{ events}=await res.json();
  return (
   <section>
    <h1 className='text-center'>The Hub for Every Dev <br /> Event You cant Miss
    </h1>
    <p className='text-center mt-5'>Hackathons, Meetups and Conferences All in One Place</p>
    <ExploreBtn/>
    <div className='mt-20 space-y-7'>
      <h3>Featured Events</h3>
      <ul className='events'>
        {events && events.length>0&&events.map((event:IEvent)=>(
          <li key={event.title}>
            <EventCard {...event}/>
          </li>
         
        ))}
      </ul>
    </div>
   </section>
  )
}
export default page