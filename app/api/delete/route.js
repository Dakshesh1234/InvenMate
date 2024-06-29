import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");

  // Replace the uri string with your connection string.
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to MongoDB

    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Check if the ID is valid before attempting to delete
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // Convert the ID string to ObjectId
    const objectId = new ObjectId(id);

    // Perform deletion operation
    const result = await inventory.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await client.close(); // Close the MongoDB connection
  }
}
