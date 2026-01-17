import  Image  from 'next/image';
import  Link  from 'next/link';
import React from 'react'

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
  return (
    /* FIX 1: Single quotes ki jagah Backticks ( ` ) use karein */
    /* FIX 2: /event/ ki jagah /events/ karein kyunki folder ka naam events hai */
    <Link href={`/events/${slug}`} id="event-card">
      
      {/* Safety: Agar image empty string hai toh crash na ho */}
      <Image 
        src={image || "/placeholder.jpg"} 
        alt={title} 
        width={410} 
        height={300} 
        className="poster"
      />

      <div className='flex flex-row gap-2'>
        <Image src="/icons/pin.svg" alt="location" width={14} height={14}/>
        <p>{location}</p>
        <div className='date-time'>
          <div>
            <Image src="/icons/calendar.svg" alt="date" width={14} height={14}/>
            <p>{date}</p>
          </div>
          <div>
            <Image src="/icons/clock.svg" alt="time" width={14} height={14}/>
            <p>{time}</p>
          </div>
        </div>
      </div>
      <p className='title'>{title}</p>
    </Link>
  )
}

export default EventCard;