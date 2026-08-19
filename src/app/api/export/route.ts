import { NextResponse } from 'next/server';
import { INITIAL_MEMBERS } from '@/lib/tree-layout';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { format = 'json', title = 'Heritage Tree Scroll' } = body;

    const exportData = {
      title,
      exportedAt: new Date().toISOString(),
      format,
      recordCount: INITIAL_MEMBERS.length,
      lineage: 'Imperial Lineage - Ming Dynasty Branch',
      members: INITIAL_MEMBERS,
    };

    if (format === 'json') {
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="heritage_tree_${Date.now()}.json"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      exportUrl: '#',
      data: exportData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Export failed' },
      { status: 500 }
    );
  }
}
