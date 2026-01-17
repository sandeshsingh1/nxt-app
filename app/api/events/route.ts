import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

// Cloudinary Configuration (Ye zaroori hai)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();

        // 1. Image handling
        const file = formData.get('image') as File;
        if (!file || typeof file === 'string') {
            return NextResponse.json({ message: 'Valid image file is required' }, { status: 400 });
        }

        // 2. Safe Parsing for Arrays (Tags & Agenda)
        let tags = [];
        let agenda = [];
        try {
            const rawTags = formData.get('tags') as string;
            const rawAgenda = formData.get('agenda') as string;
            
            // Agar bracket se shuru ho raha toh parse karein, warna comma se split
            tags = rawTags.startsWith('[') ? JSON.parse(rawTags) : rawTags.split(',').map(t => t.trim());
            agenda = rawAgenda.startsWith('[') ? JSON.parse(rawAgenda) : [rawAgenda];
        } catch (parseError) {
            return NextResponse.json({ message: 'Invalid format for tags or agenda' }, { status: 400 });
        }

        // 3. Cloudinary Upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'DevEvents' }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }).end(buffer);
        });

        // 4. Database Creation
        const createdEvent = await Event.create({
            title: formData.get('title'),
            description: formData.get('description'),
            overview: formData.get('overview'),
            venue: formData.get('venue'),
            location: formData.get('location'),
            date: formData.get('date'),
            time: formData.get('time'),
            mode: formData.get('mode') || 'hybrid',
            audience: formData.get('audience'),
            organizer: formData.get('organizer'),
            image: uploadResult.secure_url,
            tags,
            agenda,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });

    } catch (e) {
        console.error("Route Error:", e);
        return NextResponse.json({ 
            message: 'Event Creation Failed', 
            error: e instanceof Error ? e.message : 'Unknown'
        }, { status: 500 });
    }
}