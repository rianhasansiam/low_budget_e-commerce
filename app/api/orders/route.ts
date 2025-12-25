import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

// GET - Fetch all orders
export async function GET() {
  try {
    const collection = await getCollection("orders");
    const orders = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(orders, {
      headers: {
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const order = {
      userId: body.userId,
      items: body.items,
      totalAmount: body.totalAmount,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const collection = await getCollection("orders");
    const result = await collection.insertOne(order);

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        orderId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}