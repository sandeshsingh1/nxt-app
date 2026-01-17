import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // JSON data read karein
        const body = await req.json();

        // Data cleaning: Agar agenda ya tags string mein aa rahe hain toh unhe array banayein
        const eventData = {
            ...body,
            agenda: typeof body.agenda === 'string' ? [body.agenda] : body.agenda,
            tags: typeof body.tags === 'string' ? JSON.parse(body.tags.replace(/'/g, '"')) : body.tags
        };

        const createdEvent = await Event.create(eventData);

        return NextResponse.json(
            { message: 'Event created successfully', event: createdEvent }, 
            { status: 201 }
        );

    } catch (e) {
        console.error("Server Error:", e);
        return NextResponse.json(
            { 
                message: 'Event Creation Failed', 
                error: e instanceof Error ? e.message : 'Unknown error occurred' 
            }, 
            { status: 500 }
        );
    }
}