import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const products = await getProducts();

        const count = products.length;
        const total = products.reduce((sum, product) => sum + (product.price || 0), 0);

        return NextResponse.json({ count, total });
    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ count: 0, total: 0 });
    }
}
