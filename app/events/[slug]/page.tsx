// app/events/[slug]/page.tsx
import { notFound } from "next/navigation";

// Fallback logic add karein
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  try {
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, { 
      cache: 'no-store' 
    });

    if (!request.ok) return notFound();

    const data = await request.json();
    const event = data.event;

    if (!event) return notFound();

    return (
      <section id="event" className="p-10 text-white">
        <h1 className="text-4xl font-bold">Event Details: {event.title}</h1>
        <p className="mt-4">{event.description}</p>
      </section>
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return <div>Error loading event details.</div>;
  }
}

export default EventDetailsPage;