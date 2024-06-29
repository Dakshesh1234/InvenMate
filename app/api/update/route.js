// /pages/api/update.js
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { slug, field, value } = await request.json();

    // Replace the uri string with your connection string.
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        // Connect to the database
        const database = client.db('stock');
        const inventory = database.collection('inventory');

        // Update the specified field with the new value
        const result = await inventory.updateOne(
            { slug }, // Find the document by slug
            { $set: { [field]: value } } // Update the specified field
        );

        if (result.matchedCount > 0) {
            return NextResponse.json({ success: true, message: 'Product updated successfully' });
        } else {
            return NextResponse.json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Failed to update product' });
    } finally {
        // Ensure the client will close when you finish/error
        await client.close();
    }
}
